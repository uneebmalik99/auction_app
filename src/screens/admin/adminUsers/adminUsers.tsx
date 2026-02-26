import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  RefreshControl,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  Users,
  ChevronLeft,
  X,
  Plus,
  Check,
  XCircle,
  Clock,
  Shield,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Mail,
  Calendar as CalendarIcon,
  TrendingUp,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import { styles } from './styles';
import { appColors } from '../../../utils/appColors';
import { useAppSelector } from '../../../redux/hooks';
import {
  fetchUsers,
  updateUserStatus,
  createUser,
  fetchBrokerStats,
  fetchUserPermissions,
  updateUserPermissions,
  type User,
  type BrokerStats,
} from '../../../api/adminUsers';
import screenNames from '../../../routes/routes';
import type { RootNavigationProp } from '../../../utils/types';

const LIMIT = 10;

export default function AdminUsers() {
  const navigation = useNavigation<RootNavigationProp>();
  const currentUser = useAppSelector(state => state.profile.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [roleTab, setRoleTab] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    admin: 0,
    staff: 0,
    customer: 0,
    broker: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBrokerDetails, setShowBrokerDetails] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<User | null>(null);
  const [brokerStats, setBrokerStats] = useState<BrokerStats | null>(null);
  const [loadingBrokerStats, setLoadingBrokerStats] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] =
    useState<User | null>(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [updatingPermissions, setUpdatingPermissions] = useState(false);

  // Create user form
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 1 as 1 | 2 | 3 | 4,
    phone: '',
    address: '',
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [creating, setCreating] = useState(false);

  // Permissions form
  const [permissionsForm, setPermissionsForm] = useState({
    canView: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  });

  const isSuperAdmin = currentUser?.role === '0';

  const loadUsers = useCallback(
    async (page: number = 1, role: 'all' | 1 | 2 | 3 | 4 = 'all') => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchUsers(page, LIMIT, role);
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.total || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      loadUsers(currentPage, roleTab);
    }, [currentPage, roleTab, loadUsers]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUsers(currentPage, roleTab);
  }, [currentPage, roleTab, loadUsers]);

  const handleStatusUpdate = async (
    userId: string,
    newStatus: 'approved' | 'rejected',
  ) => {
    try {
      setProcessingId(userId);
      setError('');
      setSuccess('');
      await updateUserStatus(userId, newStatus);
      setSuccess(`User ${newStatus} successfully`);
      loadUsers(currentPage, roleTab);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to update user status:', err);
      setError(err.message || 'Failed to update user status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreateUser = async () => {
    try {
      setError('');
      setSuccess('');
      setCreating(true);
      await createUser(createForm);
      setSuccess('User created successfully');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        role: 1,
        phone: '',
        address: '',
      });
      loadUsers(currentPage, roleTab);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to create user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleBrokerClick = async (broker: User) => {
    if (broker.role === 4) {
      setSelectedBroker(broker);
      setShowBrokerDetails(true);
      try {
        setLoadingBrokerStats(true);
        const stats = await fetchBrokerStats(broker.id);
        setBrokerStats(stats);
      } catch (err: any) {
        console.error('Failed to fetch broker stats:', err);
        setError(err.message || 'Failed to load broker statistics');
      } finally {
        setLoadingBrokerStats(false);
      }
    }
  };

  const handleOpenPermissionsModal = async (user: User) => {
    setSelectedUserForPermissions(user);
    try {
      setLoadingPermissions(true);
      const existingPerms = await fetchUserPermissions(user.id);
      if (existingPerms && existingPerms.permissions) {
        setPermissionsForm({
          canView: existingPerms.permissions.canView,
          canCreate: existingPerms.permissions.canCreate,
          canUpdate: existingPerms.permissions.canUpdate,
          canDelete: existingPerms.permissions.canDelete,
        });
      } else {
        setPermissionsForm({
          canView: true,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch permissions:', err);
    } finally {
      setLoadingPermissions(false);
    }
    setShowPermissionsModal(true);
  };

  const handleUpdatePermissions = async () => {
    if (!selectedUserForPermissions) return;
    try {
      setError('');
      setSuccess('');
      setUpdatingPermissions(true);
      await updateUserPermissions(
        selectedUserForPermissions.id,
        permissionsForm,
      );
      setSuccess('Permissions updated successfully');
      setShowPermissionsModal(false);
      loadUsers(currentPage, roleTab);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to update permissions:', err);
      setError(err.message || 'Failed to update permissions');
    } finally {
      setUpdatingPermissions(false);
    }
  };

  const filteredUsers = users.filter(user => {
      if (statusFilter === 'all') return true;
    return user.status === statusFilter;
  });
    
    console.log('filteredUsers', filteredUsers);

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return { bg: '#FEF3C7', text: '#D97706' };
    if (status === 'approved') return { bg: '#D1FAE5', text: '#059669' };
    if (status === 'rejected') return { bg: '#FEE2E2', text: '#DC2626' };
    return { bg: '#F3F4F6', text: '#6B7280' };
  };

  const getRoleBadge = (role: number) => {
    if (role === 0) return { bg: '#EDE9FE', text: '#7C3AED' };
    if (role === 1) return { bg: '#DBEAFE', text: '#2563EB' };
    if (role === 2) return { bg: '#E0E7FF', text: '#4F46E5' };
    if (role === 4) return { bg: '#FED7AA', text: '#EA580C' };
    return { bg: '#F3F4F6', text: '#6B7280' };
  };

  const getRoleName = (role: number) => {
    if (role === 0) return 'Super Admin';
    if (role === 1) return 'Admin';
    if (role === 2) return 'Staff';
    if (role === 4) return 'Broker';
    return 'Customer';
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const statusStyle = getStatusBadge(item.status);
    const roleStyle = getRoleBadge(item.role);

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => item.role === 4 && handleBrokerClick(item)}
        activeOpacity={item.role === 4 ? 0.7 : 1}
      >
        <View style={styles.userCardHeader}>
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={styles.userAvatar}
            />
          ) : (
            <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
              <Text style={styles.userAvatarText}>
                {item.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.userDetails}>
          {item.phone && (
            <View style={styles.userDetailRow}>
              <Phone size={14} color={appColors.textMuted} />
              <Text style={styles.userDetailText}>{item.phone}</Text>
            </View>
          )}
          {item.address && (
            <View style={styles.userDetailRow}>
              <MapPin size={14} color={appColors.textMuted} />
              <Text style={styles.userDetailText} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.userBadges}>
          <View
            style={[
              styles.badge,
              { backgroundColor: roleStyle.bg },
            ]}
          >
            <Text style={[styles.badgeText, { color: roleStyle.text }]}>
              {getRoleName(item.role)}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: statusStyle.bg },
            ]}
          >
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.userActions}>
          {isSuperAdmin &&
            (item.role === 1 || item.role === 2 || item.role === 4) && (
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={() => handleOpenPermissionsModal(item)}
              >
                <Shield size={14} color={appColors.white} />
                <Text style={styles.permissionButtonText}>Permissions</Text>
              </TouchableOpacity>
            )}

          {item.role === 3 && item.status === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleStatusUpdate(item.id, 'approved')}
                disabled={processingId === item.id}
              >
                {processingId === item.id ? (
                  <ActivityIndicator size="small" color={appColors.white} />
                ) : (
                  <>
                    <Check size={14} color={appColors.white} />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleStatusUpdate(item.id, 'rejected')}
                disabled={processingId === item.id}
              >
                <XCircle size={14} color={appColors.white} />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}

          {item.role === 3 && item.status === 'rejected' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleStatusUpdate(item.id, 'approved')}
              disabled={processingId === item.id}
            >
              {processingId === item.id ? (
                <ActivityIndicator size="small" color={appColors.white} />
              ) : (
                <>
                  <Check size={14} color={appColors.white} />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {item.role === 4 && (
            <View style={styles.brokerHint}>
              <Text style={styles.brokerHintText}>Tap for details</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={appColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Users</Text>
        {isSuperAdmin && (
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            style={styles.createButton}
          >
            <Plus size={24} color={appColors.white} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <View style={styles.alertError}>
          <AlertCircle size={20} color={appColors.red} />
          <Text style={styles.alertText}>{error}</Text>
          <TouchableOpacity onPress={() => setError('')}>
            <X size={20} color={appColors.red} />
          </TouchableOpacity>
        </View>
      ) : null}

      {success ? (
        <View style={styles.alertSuccess}>
          <CheckCircle size={20} color={appColors.green} />
          <Text style={styles.alertText}>{success}</Text>
          <TouchableOpacity onPress={() => setSuccess('')}>
            <X size={20} color={appColors.green} />
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.primary]}
            tintColor={appColors.primary}
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Users size={24} color={appColors.primary} />
            <Text style={styles.statValue}>{totalUsers}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color={appColors.yellow} />
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle size={24} color={appColors.green} />
            <Text style={styles.statValue}>{stats.approved}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <XCircle size={24} color={appColors.red} />
            <Text style={styles.statValue}>{stats.rejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {/* Role Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {[
            { key: 'all', label: 'All', count: totalUsers },
            { key: 1, label: 'Admin', count: stats.admin },
            { key: 2, label: 'Staff', count: stats.staff },
            { key: 4, label: 'Broker', count: stats.broker },
            { key: 3, label: 'Customer', count: stats.customer },
          ].map(tab => (
            <TouchableOpacity
              key={String(tab.key)}
              style={[
                styles.tab,
                roleTab === tab.key && styles.tabActive,
              ]}
              onPress={() => {
                setRoleTab(tab.key as any);
                setCurrentPage(1);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  roleTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Status Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {[
            { key: 'all', label: 'All Status' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
          ].map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                statusFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => {
                setStatusFilter(filter.key as any);
                setCurrentPage(1);
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === filter.key && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Users List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={appColors.primary} />
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : filteredUsers.length > 0 ? (
          <>
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.usersList}
            />
            {/* Pagination */}
            {totalPages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} color={appColors.textPrimary} />
                  <Text style={styles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.paginationText}>
                  Page {currentPage} of {totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === totalPages && styles.paginationButtonDisabled,
                  ]}
                  onPress={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.paginationButtonText}>Next</Text>
                  <ChevronLeft
                    size={20}
                    color={appColors.textPrimary}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Users size={48} color={appColors.textMuted} />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>
              {roleTab === 'all'
                ? 'No users have registered yet'
                : `No ${getRoleName(roleTab as number).toLowerCase()} users found`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create User Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create User</Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={appColors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={createForm.name}
                  onChangeText={text =>
                    setCreateForm({ ...createForm, name: text })
                  }
                  placeholder="John Doe"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={createForm.email}
                  onChangeText={text =>
                    setCreateForm({ ...createForm, email: text })
                  }
                  placeholder="user@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Password <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.formInput}
                    value={createForm.password}
                    onChangeText={text =>
                      setCreateForm({ ...createForm, password: text })
                    }
                    placeholder="••••••••"
                    secureTextEntry={!showCreatePassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCreatePassword(!showCreatePassword)}
                    style={styles.passwordToggle}
                  >
                    {showCreatePassword ? (
                      <EyeOff size={20} color={appColors.textMuted} />
                    ) : (
                      <Eye size={20} color={appColors.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Role <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.roleButtons}>
                  {[
                    { value: 1, label: 'Admin' },
                    { value: 2, label: 'Staff' },
                    { value: 3, label: 'Customer' },
                    { value: 4, label: 'Broker' },
                  ].map(role => (
                    <TouchableOpacity
                      key={role.value}
                      style={[
                        styles.roleButton,
                        createForm.role === role.value && styles.roleButtonActive,
                      ]}
                      onPress={() =>
                        setCreateForm({
                          ...createForm,
                          role: role.value as 1 | 2 | 3 | 4,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          createForm.role === role.value &&
                            styles.roleButtonTextActive,
                        ]}
                      >
                        {role.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.formInput}
                  value={createForm.phone}
                  onChangeText={text =>
                    setCreateForm({ ...createForm, phone: text })
                  }
                  placeholder="+92 300 1234567"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={createForm.address}
                  onChangeText={text =>
                    setCreateForm({ ...createForm, address: text })
                  }
                  placeholder="Street address, City, Country"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleCreateUser}
                disabled={creating || !createForm.name || !createForm.email || !createForm.password}
              >
                {creating ? (
                  <ActivityIndicator size="small" color={appColors.white} />
                ) : (
                  <>
                    <Plus size={20} color={appColors.white} />
                    <Text style={styles.modalButtonTextPrimary}>Create</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Broker Details Modal */}
      <Modal
        visible={showBrokerDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBrokerDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.brokerModalContent]}>
            <View style={[styles.modalHeader, styles.brokerModalHeader]}>
              <View>
                <Text style={styles.modalTitle}>Broker Details</Text>
                {selectedBroker && (
                  <Text style={styles.modalSubtitle}>{selectedBroker.name}</Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowBrokerDetails(false);
                  setSelectedBroker(null);
                  setBrokerStats(null);
                }}
                style={styles.modalCloseButton}
              >
                <X size={24} color={appColors.white} />
              </TouchableOpacity>
            </View>
            {selectedBroker && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.brokerInfo}>
                  {selectedBroker.profileImage ? (
                    <Image
                      source={{ uri: selectedBroker.profileImage }}
                      style={styles.brokerAvatar}
                    />
                  ) : (
                    <View style={styles.brokerAvatarPlaceholder}>
                      <Text style={styles.brokerAvatarText}>
                        {selectedBroker.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.brokerName}>{selectedBroker.name}</Text>
                  <View style={styles.brokerContact}>
                    <View style={styles.brokerContactRow}>
                      <Mail size={16} color={appColors.textMuted} />
                      <Text style={styles.brokerContactText}>
                        {selectedBroker.email}
                      </Text>
                    </View>
                    {selectedBroker.phone && (
                      <View style={styles.brokerContactRow}>
                        <Phone size={16} color={appColors.textMuted} />
                        <Text style={styles.brokerContactText}>
                          {selectedBroker.phone}
                        </Text>
                      </View>
                    )}
                    {selectedBroker.address && (
                      <View style={styles.brokerContactRow}>
                        <MapPin size={16} color={appColors.textMuted} />
                        <Text style={styles.brokerContactText}>
                          {selectedBroker.address}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {loadingBrokerStats ? (
                  <View style={styles.statsLoading}>
                    <ActivityIndicator size="large" color={appColors.orange} />
                    <Text style={styles.statsLoadingText}>
                      Loading statistics...
                    </Text>
                  </View>
                ) : brokerStats ? (
                  <View style={styles.brokerStatsGrid}>
                    <View style={styles.brokerStatCard}>
                      <View style={styles.brokerStatIcon}>
                        <TrendingUp size={24} color={appColors.green} />
                      </View>
                      <Text style={styles.brokerStatValue}>
                        {brokerStats.liveAuctions}
                      </Text>
                      <Text style={styles.brokerStatLabel}>Live Auctions</Text>
                    </View>
                    <View style={styles.brokerStatCard}>
                      <View style={styles.brokerStatIcon}>
                        <CalendarIcon size={24} color={appColors.blue} />
                      </View>
                      <Text style={styles.brokerStatValue}>
                        {brokerStats.upcomingAuctions}
                      </Text>
                      <Text style={styles.brokerStatLabel}>Upcoming</Text>
                    </View>
                    <View style={styles.brokerStatCard}>
                      <View style={styles.brokerStatIcon}>
                        <Clock size={24} color={appColors.purple} />
                      </View>
                      <Text style={styles.brokerStatValue}>
                        {brokerStats.pendingAuctions}
                      </Text>
                      <Text style={styles.brokerStatLabel}>Pending</Text>
                    </View>
                    <View style={styles.brokerStatCard}>
                      <View style={styles.brokerStatIcon}>
                        <CheckCircle size={24} color={appColors.green} />
                      </View>
                      <Text style={styles.brokerStatValue}>
                        {brokerStats.soldAuctions}
                      </Text>
                      <Text style={styles.brokerStatLabel}>Sold Vehicles</Text>
                    </View>
                    <View style={styles.brokerStatCard}>
                      <View style={styles.brokerStatIcon}>
                        <Package size={24} color={appColors.orange} />
                      </View>
                      <Text style={styles.brokerStatValue}>
                        {brokerStats.totalVehicles}
                      </Text>
                      <Text style={styles.brokerStatLabel}>Total Vehicles</Text>
                    </View>
                    <View style={styles.brokerStatCard}>
                      <View style={styles.brokerStatIcon}>
                        <DollarSign size={24} color={appColors.green} />
                      </View>
                      <Text style={styles.brokerStatValue}>
                        ${brokerStats.totalRevenue.toLocaleString()}
                      </Text>
                      <Text style={styles.brokerStatLabel}>Total Revenue</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.statsError}>
                    <AlertCircle size={48} color={appColors.textMuted} />
                    <Text style={styles.statsErrorText}>
                      Failed to load statistics
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => {
                  setShowBrokerDetails(false);
                  setSelectedBroker(null);
                  setBrokerStats(null);
                }}
              >
                <Text style={styles.modalButtonTextPrimary}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Permissions Modal */}
      <Modal
        visible={showPermissionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPermissionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, styles.permissionsModalHeader]}>
              <View>
                <Text style={styles.modalTitle}>Manage Permissions</Text>
                {selectedUserForPermissions && (
                  <Text style={styles.modalSubtitle}>
                    {selectedUserForPermissions.name}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setShowPermissionsModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={appColors.white} />
              </TouchableOpacity>
            </View>
            {loadingPermissions ? (
              <View style={styles.permissionsLoading}>
                <ActivityIndicator size="large" color={appColors.purple} />
                <Text style={styles.permissionsLoadingText}>
                  Loading permissions...
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.modalBody}>
                {[
                  {
                    key: 'canView',
                    label: 'View',
                    description: 'Can view data',
                    icon: Eye,
                  },
                  {
                    key: 'canCreate',
                    label: 'Create',
                    description: 'Can create new items',
                    icon: Plus,
                  },
                  {
                    key: 'canUpdate',
                    label: 'Update',
                    description: 'Can edit existing items',
                    icon: Check,
                  },
                  {
                    key: 'canDelete',
                    label: 'Delete',
                    description: 'Can delete items',
                    icon: XCircle,
                  },
                ].map(perm => (
                  <TouchableOpacity
                    key={perm.key}
                    style={styles.permissionItem}
                    onPress={() =>
                      setPermissionsForm({
                        ...permissionsForm,
                        [perm.key]: !permissionsForm[perm.key as keyof typeof permissionsForm],
                      })
                    }
                  >
                    <View style={styles.permissionItemLeft}>
                      <perm.icon
                        size={20}
                        color={
                          permissionsForm[perm.key as keyof typeof permissionsForm]
                            ? appColors.green
                            : appColors.textMuted
                        }
                      />
                      <View>
                        <Text style={styles.permissionItemLabel}>
                          {perm.label}
                        </Text>
                        <Text style={styles.permissionItemDescription}>
                          {perm.description}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        permissionsForm[perm.key as keyof typeof permissionsForm] &&
                          styles.checkboxChecked,
                      ]}
                    >
                      {permissionsForm[perm.key as keyof typeof permissionsForm] && (
                        <Check size={16} color={appColors.white} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowPermissionsModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleUpdatePermissions}
                disabled={updatingPermissions}
              >
                {updatingPermissions ? (
                  <ActivityIndicator size="small" color={appColors.white} />
                ) : (
                  <>
                    <Shield size={20} color={appColors.white} />
                    <Text style={styles.modalButtonTextPrimary}>Update</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
