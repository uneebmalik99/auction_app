import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import {
  CommonActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { styles } from './styles';
import {
  Button,
  CheckBox,
  ConfirmationModal,
  Header,
  ImagePickerField,
  Input,
  LoadingModal,
} from '../../../components';
import { useImagePicker } from '../../../hooks/useImagePicker';
import MultiCheckBox from '../../../components/multiCheckBox/multiCheckBox';
import {
  createAuctionItem,
  type CreateAuctionItemPayload,
  updateAuctionItem,
} from '../../../api/items';
import DatePicker from 'react-native-date-picker';
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from '../../../utils/methods';
import screenNames from '../../../routes/routes';
import { AuctionItem, FeatureOption } from '../../../utils/types';
import {
  bodyTypeOptions,
  driveTypeOptions,
  featureOptions,
  fuelTypeOptions,
  roofTypeOptions,
  transmissionTypeOptions,
} from '../../../utils/data';
import { decodeVin } from '../../../api/vin';
import { 
  FileText, 
  Gavel, 
  CheckCircle,
  Car,
  Settings,
  Upload,
  AlertCircle,
  BarChart3,
  X,
  Play,
} from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import { pick, types,  } from '@react-native-documents/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useI18n } from '../../../i18n';

// Vehicle Condition Types
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'damage';

interface ConditionOption {
  id: VehicleCondition;
  label: string;
  color: string;
  description: string;
}

// CONDITION_OPTIONS will be created inside component to use translations

interface DamageReport {
  x: number;
  y: number;
  type: string;
  note: string;
}

interface ExtendedAuctionItem extends AuctionItem {
  videoUri?: string;
  documentUris?: string[];
  vehicleCondition?: VehicleCondition;
  damageReports?: DamageReport[];
}

export default function AddAuctionItem() {
  const { t } = useI18n();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editItem = (route.params?.item ?? null) as
    | (AuctionItem & { _id: string })
    | null;
  const isEdit = route.params?.mode === 'edit' && !!editItem;

  const CONDITION_OPTIONS: ConditionOption[] = [
    {
      id: 'excellent',
      label: t('addAuction.condition.excellent'),
      color: '#10B981',
      description: t('addAuction.condition.excellentDesc'),
    },
    {
      id: 'good',
      label: t('addAuction.condition.good'),
      color: '#3B82F6',
      description: t('addAuction.condition.goodDesc'),
    },
    {
      id: 'fair',
      label: t('addAuction.condition.fair'),
      color: '#F59E0B',
      description: t('addAuction.condition.fairDesc'),
    },
    {
      id: 'damage',
      label: t('addAuction.condition.damage'),
      color: '#EF4444',
      description: t('addAuction.condition.damageDesc'),
    },
  ];

  const { images, pickImages, removeImage, clearImages, setImagesFromUris } =
    useImagePicker({
      maxImages: 10,
    });

  // Extended form for new steps
  const [form, setForm] = useState<ExtendedAuctionItem>({
    _id: '',
    title: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    horsePower: '',
    engineCapacity: '',
    engineCylinder: '',
    noOfSeats: '',
    warranty: false,
    serviceHistory: false,
    rimSize: '',
    fuelType: '',
    driveType: '',
    roofType: '',
    bodyType: '',
    transmissionType: '',
    color: '',
    registrationCity: '',
    noOfKeys: '',
    location: '',
    startingPrice: '',
    minimumBidIncrement: '',
    biddingStartsAt: undefined,
    biddingEndsAt: undefined,
    description: '',
    photos: [],
    features: {
      adaptiveCruiseControl: false,
      autoDimmingMirrors: false,
      cruiseControl: false,
      headsUpDisplay: false,
      navigationSystem: false,
      parkingSensors: false,
      reversingCamera: false,
      steeringWheelControls: false,
      automatedParking: false,
      birdsEyeViewCamera: false,
      digitalDisplay: false,
      digitalDisplayMirrors: false,
      paddleShifters: false,
      wirelessCharging: false,
      bluetooth: false,
      appleCarPlay: false,
      androidAuto: false,
      premiumSoundSystem: false,
      rearEntertainmentScreen: false,
      sunroof: false,
      keylessEntry: false,
      leatherSeats: false,
      lumberSupport: false,
      memorySeats: false,
      powerfoldingMirrors: false,
      powerSeats: false,
      pushStart: false,
      ambientLighting: false,
      electricRunningBoard: false,
      handsFreeLiftGate: false,
      heatedCooledSeats: false,
      messageSeats: false,
      remoteStart: false,
      softCloseDoors: false,
      blindSpotMonitor: false,
      brakeAssist: false,
      fogLights: false,
      laneKeepAssist: false,
      ledHeadlights: false,
      colloisionWarningSystem: false,
    },
    status: 'upcoming',
    currentBid: undefined,
    createdAt: '',
    updatedAt: '',
    sellerId: undefined,
    firstOwner: false,
    sellerNationality: '',
    videoUri: undefined,
    documentUris: [],
    vehicleCondition: 'good',
    damageReports: [],
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinTouched, setVinTouched] = useState(false);
  const lastDecodedVinRef = useRef<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(1);
  
  // Damage report state
  const [damageMarkerPosition, setDamageMarkerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentDamageType, setCurrentDamageType] = useState('');
  const [selectedConditionImageIndex, setSelectedConditionImageIndex] = useState(0);

  // Media state
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ uri: string; name: string }>>([]);
  const [uploadedMediaImages, setUploadedMediaImages] = useState<Array<{ uri: string }>>([]);
  const [damageCanvasLayout, setDamageCanvasLayout] = useState<{ width: number; height: number } | null>(null);

  // Validation flags
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Generic handler for text/number inputs
  const handleTextChange = <K extends keyof ExtendedAuctionItem>(
    key: K,
    value: string | number | boolean,
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  // Handle nested features
  const handleFeatureChange = (
    key: keyof AuctionItem['features'],
    value: boolean,
  ) => {
    setForm(prev => ({
      ...prev,
      features: { ...prev.features, [key]: value },
    }));
    setIsDirty(true);
  };

  // Handle single-select options
  const handleSingleSelect = <
    K extends
      | 'fuelType'
      | 'transmissionType'
      | 'driveType'
      | 'bodyType'
      | 'roofType',
  >(
    key: K,
    value: AuctionItem[K],
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  // Pre-fill form when editing
  useEffect(() => {
    if (!isEdit || !editItem) return;

    setForm(prev => ({
      ...prev,
      ...editItem,
      features: {
        ...prev.features,
        ...(editItem.features || {}),
      },
      biddingStartsAt: editItem.biddingStartsAt || undefined,
      biddingEndsAt: editItem.biddingEndsAt || undefined,
    }));

    if (Array.isArray(editItem.photos) && editItem.photos.length > 0) {
      setImagesFromUris(editItem.photos);
    }

    setIsDirty(false);
    setVinTouched(false);
    lastDecodedVinRef.current = null;
  }, [isEdit, editItem, setImagesFromUris]);

  // VIN auto-fill (debounced)
  useEffect(() => {
    const vin = String(form.vin ?? '').trim().toUpperCase();
    if (!vinTouched) return;
    if (vin.length !== 17) return;
    if (lastDecodedVinRef.current === vin) return;

    const timer = setTimeout(async () => {
      try {
        setVinDecoding(true);
        const decoded = await decodeVin(vin);

        setForm(prev => ({
          ...prev,
          make: prev.make || decoded.make || prev.make,
          model: prev.model || decoded.model || prev.model,
          year: prev.year || decoded.year || prev.year,
          engineCylinder: prev.engineCylinder || decoded.engineCylinders || prev.engineCylinder,
          engineCapacity: prev.engineCapacity || decoded.engineCapacity || prev.engineCapacity,
          horsePower: prev.horsePower || decoded.horsePower || prev.horsePower,
          fuelType: prev.fuelType || decoded.fuelType || prev.fuelType,
          driveType: prev.driveType || decoded.driveType || prev.driveType,
          transmissionType:
            prev.transmissionType || decoded.transmissionType || prev.transmissionType,
          bodyType: prev.bodyType || decoded.bodyType || prev.bodyType,
        }));

        lastDecodedVinRef.current = vin;
        showSuccessToast(t('addAuction.autoFilledFromVin'), t('addAuction.autoFilledMessage'));
      } catch (e) {
        showErrorToast(
          t('addAuction.vinLookupFailed'),
          e instanceof Error ? e.message : 'Unable to decode VIN.',
        );
      } finally {
        setVinDecoding(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [form.vin, vinTouched]);

  const formatDateTime = (date?: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return d
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', ' at');
  };

  // Extract selected IDs for MultiCheckBox
  const selectedFeatureIds = Object.entries(form.features || {})
    .filter(([_, value]) => value)
    .map(([key]) => key);

  // Validation helpers
  const hasText = (v: any) => {
    if (v == null) return false;
    return String(v).trim().length > 0;
  };

  const toNumber = (v: any) => {
    if (typeof v === 'number') return v;
    const s = String(v ?? '').trim();
    if (!s) return NaN;
    return Number(s);
  };

  const hasNumber = (v: any) => Number.isFinite(toNumber(v));

  // Step validations
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    const startingPrice = toNumber(form.startingPrice);
    const minIncrement = toNumber(form.minimumBidIncrement);

    if (!Number.isFinite(startingPrice) || startingPrice <= 0) {
      errors.startingPrice = t('addAuction.validStartingPriceRequired');
    }
    if (!Number.isFinite(minIncrement) || minIncrement <= 0) {
      errors.minimumBidIncrement = t('addAuction.validMinimumBidRequired');
    }
    if (!form.biddingStartsAt) {
      errors.biddingStartsAt = t('addAuction.biddingStartDateRequired');
    }
    if (!form.biddingEndsAt) {
      errors.biddingEndsAt = t('addAuction.biddingEndDateRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!hasText(form.title)) errors.title = t('addAuction.titleRequired');
    if (!hasText(form.make)) errors.make = t('addAuction.makeRequired');
    if (!hasText(form.model)) errors.model = t('addAuction.modelRequired');
    const year = toNumber(form.year);
    if (!(Number.isFinite(year) && year >= 1900)) errors.year = t('addAuction.validYearRequired');
    const vin = String(form.vin ?? '').trim();
    if (vin.length !== 17) errors.vin = 'VIN must be 17 characters';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    const mileage = toNumber(form.mileage);
    
    if (!(Number.isFinite(mileage) && mileage >= 0)) {
      errors.mileage = t('addAuction.validMileageRequired');
    }
    if (!hasText(form.color)) errors.color = t('addAuction.colorRequired');
    if (!hasText(form.location)) errors.location = t('addAuction.locationRequired');

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = () => {
    const errors: Record<string, string> = {};
    if (!hasText(form.registrationCity)) {
      errors.registrationCity = t('addAuction.registrationCityRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep5 = () => {
    // Media is optional
    return true;
  };

  const validateStep6 = () => {
    // Documents are optional
    return true;
  };

  const validateStep7 = () => {
    // Features are optional
    return true;
  };

  const validateStep8 = () => {
    const errors: Record<string, string> = {};
    if (!form.vehicleCondition) {
      errors.vehicleCondition = t('addAuction.selectVehicleCondition');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep9 = () => {
    const errors: Record<string, string> = {};
    if (!images.length) {
      errors.photos = t('addAuction.atLeastOnePhotoRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const steps = useMemo(
    () => [
      { key: 1 as const, label: t('addAuction.step1Label'), Icon: Gavel },
      { key: 2 as const, label: t('addAuction.step2Label'), Icon: FileText },
      { key: 3 as const, label: t('addAuction.step3Label'), Icon: Car },
      { key: 4 as const, label: t('addAuction.step4Label'), Icon: CheckCircle },
      { key: 5 as const, label: t('addAuction.step5Label'), Icon: Upload },
      { key: 6 as const, label: t('addAuction.step6Label'), Icon: FileText },
      { key: 7 as const, label: t('addAuction.step7Label'), Icon: Settings },
      { key: 8 as const, label: t('addAuction.step8Label'), Icon: BarChart3 },
      { key: 9 as const, label: t('addAuction.step9Label'), Icon: Upload },
    ],
    [t],
  );

  const progress = (step - 1) / (steps.length - 1);

  const goBack = () => {
    if (step > 1) {
      setStep((step - 1) as any);
      return;
    }
    handleConfirmLeave();
  };

  const handleConfirmLeave = () => {
    if (isDirty) {
      setModalVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const handleLeave = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const handleCreateOrUpdate = async () => {
    try {
      setSaving(true);

      // Validate all critical fields
      if (
        !hasText(form.title) ||
        !hasText(form.make) ||
        !hasText(form.model) ||
        !hasNumber(form.year) ||
        !hasText(form.vin) ||
        !hasNumber(form.startingPrice) ||
        !form.biddingStartsAt ||
        !form.biddingEndsAt ||
        !hasNumber(form.minimumBidIncrement) ||
        !hasNumber(form.mileage) ||
        !hasText(form.registrationCity) ||
        !images.length
      ) {
        showInfoToast(t('addAuction.validationError'), t('addAuction.completeAllFields'));
        return;
      }

      const payload: CreateAuctionItemPayload = {
        title: form.title.trim(),
        make: form.make.trim(),
        model: form.model.trim(),
        year: form.year,
        vin: form.vin.trim(),
        mileage: form.mileage,
        horsePower: form.horsePower,
        engineCapacity: form.engineCapacity.trim(),
        engineCylinder: form.engineCylinder.trim(),
        noOfSeats: form.noOfSeats,
        warranty: form.warranty ?? false,
        serviceHistory: form.serviceHistory ?? false,
        rimSize: form.rimSize.trim() ?? '',
        fuelType: form.fuelType,
        driveType: form.driveType,
        roofType: form.roofType.trim() ?? '',
        bodyType: form.bodyType.trim() ?? '',
        transmissionType: form.transmissionType,
        color: form.color.trim(),
        registrationCity: form.registrationCity.trim() ?? '',
        noOfKeys: form.noOfKeys,
        location: form.location.trim(),
        startingPrice: form.startingPrice,
        minimumBidIncrement: form.minimumBidIncrement,
        biddingStartsAt: form.biddingStartsAt,
        biddingEndsAt: form.biddingEndsAt,
        description: form.description?.trim() ?? '',
        photos: images.map(img => img.uri ?? ''),
        features: form.features,
        status: form.status,
        firstOwner: form.firstOwner ?? false,
        sellerNationality: form.sellerNationality.trim() ?? '',
      };

      console.log('Add Auction Item Payload', payload);

      // Uncomment when API is ready
      if (isEdit && editItem?._id) {
        await updateAuctionItem(editItem._id, payload, images);
        showSuccessToast(t('addAuction.auctionUpdated'));
      } else {
        try {await createAuctionItem(payload, images);
        showSuccessToast(t('addAuction.auctionCreated'));
           navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: screenNames.adminHomeTab,
              state: {
                routes: [{ name: screenNames.adminAuctionItems }],
                index: 0,
              },
            },
          ],
        }),
      );
        } catch (error) {
         throw error
        }
        
      }

      // showSuccessToast('Success', 'Auction item created successfully!');

     
    } catch (err) {
      console.error('failde to create auction', err)
      showErrorToast(
        'Operation failed',
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    let isValid = true;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      case 5:
        isValid = validateStep5();
        break;
      case 6:
        isValid = validateStep6();
        break;
      case 7:
        isValid = validateStep7();
        break;
      case 8:
        isValid = validateStep8();
        break;
      case 9:
        isValid = validateStep9();
        if (isValid) {
          handleCreateOrUpdate();
          return;
        }
        break;
    }

    if (!isValid) {
      showInfoToast(t('addAuction.validationError'), t('addAuction.fillAllRequiredFields'));
      return;
    }

    if (step < 9) {
      setStep((step + 1) as any);
      setValidationErrors({});
    }
  };

  const handleDamageMarkPress = (
    event: GestureResponderEvent,
    imageWidth: number,
    imageHeight: number,
  ) => {
    const { locationX, locationY } = event.nativeEvent;
    const x = locationX / imageWidth;
    const y = locationY / imageHeight;
    setDamageMarkerPosition({ x, y });
  };

  const addDamageReport = () => {
    if (!damageMarkerPosition || !currentDamageType) return;

    const newReports = [
      ...(form.damageReports || []),
      {
        x: damageMarkerPosition.x,
        y: damageMarkerPosition.y,
        type: currentDamageType,
        note: '',
      },
    ];

    setForm(prev => ({
      ...prev,
      damageReports: newReports,
    }));

    setDamageMarkerPosition(null);
    setCurrentDamageType('');
  };

  const removeDamageReport = (index: number) => {
    const newReports = form.damageReports?.filter((_, i) => i !== index) || [];
    setForm(prev => ({
      ...prev,
      damageReports: newReports,
    }));
  };

  const pickVideoFile = async () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'video',
          videoQuality: 'high',
        },
        (response) => {
          if (response.didCancel) {
            console.log('User cancelled video selection');
          } else if (response.errorCode) {
            showErrorToast(t('addAuction.error'), response.errorMessage || t('addAuction.failedToPickVideo'));
          } else if (response.assets && response.assets[0]) {
            const video = response.assets[0];
            if (video.fileSize && video.fileSize > 100 * 1024 * 1024) {
              showErrorToast(t('addAuction.error'), t('addAuction.videoSizeLimit'));
              return;
            }
            setForm(prev => ({
              ...prev,
              videoUri: video.uri,
            }));
            setIsDirty(true);
            showSuccessToast(t('addAuction.success'), t('addAuction.videoSelected'));
          }
        }
      );
    } catch (error) {
      showErrorToast(t('addAuction.error'), t('addAuction.failedToPickVideo'));
    }
  };

  const removeVideo = () => {
    setForm(prev => ({
      ...prev,
      videoUri: undefined,
    }));
    setIsDirty(true);
  };

  const pickDocuments = async () => {
    try {
      const results = await pick({
        type: [types.pdf, types.images, types.doc, types.docx],
        allowMultiSelection: true,
      });

      const newDocs = results.map(doc => ({
        uri: doc.uri,
        name: doc.name || 'Document',
      }));

      setUploadedDocuments(prev => [...prev, ...newDocs]);
      setIsDirty(true);
      showSuccessToast(t('addAuction.success'), `${results.length} ${t('addAuction.documentsSelected')}`);
    } catch (err) {
      showErrorToast(t('addAuction.error'), t('addAuction.failedToPickDocuments'));
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const pickMediaImages = async () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          selectionLimit: 10,
          quality: 0.8,
        },
        (response) => {
          if (response.didCancel) {
            console.log('User cancelled media image selection');
          } else if (response.errorCode) {
            showErrorToast(t('addAuction.error'), response.errorMessage || t('addAuction.failedToPickImages'));
          } else if (response.assets) {
            const newImages = response.assets.map(asset => ({
              uri: asset.uri || '',
            }));
            setUploadedMediaImages(prev => [...prev.slice(0, 10 - newImages.length), ...newImages].slice(0, 10));
            setIsDirty(true);
            showSuccessToast(t('addAuction.success'), `${newImages.length} ${t('addAuction.imagesSelected')}`);
          }
        }
      );
    } catch (error) {
      showErrorToast(t('addAuction.error'), t('addAuction.failedToPickImages'));
    }
  };

  const removeMediaImage = (index: number) => {
    setUploadedMediaImages(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const getStepTitle = (): string => {
    const titles: Record<number, string> = {
      1: t('addAuction.step1Title'),
      2: t('addAuction.step2Title'),
      3: t('addAuction.step3Title'),
      4: t('addAuction.step4Title'),
      5: t('addAuction.step5Title'),
      6: t('addAuction.step6Title'),
      7: t('addAuction.step7Title'),
      8: t('addAuction.step8Title'),
      9: t('addAuction.step9Title'),
    };
    return titles[step];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={isEdit ? t('addAuction.editTitle') : t('addAuction.addTitle')}
        showBackButton
        onBackPress={goBack}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.wizardTitle}>{getStepTitle()}</Text>
        <Text style={styles.wizardSubtitle}>
          {t('addAuction.step')} {step} {t('addAuction.of')} {steps.length}
        </Text>

        <View style={styles.stepperWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
        </View>

        {/* STEP 1: Auction Information */}
        {step === 1 && (
          <View style={styles.formSection}>
            <Input
              label={
                <Text>
                  {t('addAuction.startingPrice')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              placeholder="e.g. 50000"
              value={String(form.startingPrice)}
              keyboardType="numeric"
              onChangeText={t =>
                handleTextChange('startingPrice', Number(t) || 0)
              }
              error={validationErrors.startingPrice}
            />
            <Input
              label={
                <Text>
                  {t('addAuction.minimumBidIncrement')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              placeholder="e.g. 500"
              value={String(form.minimumBidIncrement)}
              keyboardType="numeric"
              onChangeText={t =>
                handleTextChange('minimumBidIncrement', Number(t) || 0)
              }
              error={validationErrors.minimumBidIncrement}
            />

            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Input
                label={
                  <Text>
                    {t('addAuction.biddingStartsAt')} <Text style={styles.requiredStar}>*</Text>
                  </Text>
                }
                placeholder={t('addAuction.selectDateTime')}
                value={formatDateTime(form.biddingStartsAt)}
                editable={false}
                pointerEvents="none"
                error={validationErrors.biddingStartsAt}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Input
                label={
                  <Text>
                    {t('addAuction.biddingEndsAt')} <Text style={styles.requiredStar}>*</Text>
                  </Text>
                }
                placeholder={t('addAuction.selectDateTime')}
                value={formatDateTime(form.biddingEndsAt)}
                editable={false}
                pointerEvents="none"
                error={validationErrors.biddingEndsAt}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: Basic Information */}
        {step === 2 && (
          <View style={styles.formSection}>
            <Input
              label={
                <Text>
                  {t('addAuction.title')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              value={form.title}
              onChangeText={t => handleTextChange('title', t)}
              placeholder="e.g. Toyota Corolla 2020"
              error={validationErrors.title}
            />
            <Input
              label={
                <Text>
                  {t('addAuction.make')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              placeholder="e.g. Toyota"
              value={form.make}
              onChangeText={t => handleTextChange('make', t)}
              error={validationErrors.make}
            />
            <Input
              label={
                <Text>
                  {t('addAuction.model')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              placeholder="e.g. Corolla"
              value={form.model}
              onChangeText={t => handleTextChange('model', t)}
              error={validationErrors.model}
            />
            <Input
              label={
                <Text>
                  {t('addAuction.year')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              placeholder="e.g. 2020"
              value={String(form.year)}
              keyboardType="numeric"
              onChangeText={t => handleTextChange('year', Number(t) || 0)}
              error={validationErrors.year}
            />
            <Input
              label={
                <Text>
                  {t('addAuction.vin')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              value={form.vin}
              placeholder="e.g. 1HGCM82633A123456"
              onChangeText={t => {
                setVinTouched(true);
                handleTextChange('vin', t);
              }}
              error={validationErrors.vin}
            />
            {vinDecoding && (
              <View style={styles.vinStatusRow}>
                <ActivityIndicator size="small" color={appColors.primary} />
                <Text style={styles.helperText}>{t('addAuction.fetchingVin')}</Text>
              </View>
            )}
          </View>
        )}

        {/* STEP 3: Vehicle Details */}
        {step === 3 && (
          <View style={styles.formSection}>
            <Input
              label={
                <Text>
                  {t('addAuction.mileage')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              placeholder="e.g. 45000"
              value={String(form.mileage)}
              keyboardType="numeric"
              onChangeText={t => handleTextChange('mileage', Number(t) || 0)}
              error={validationErrors.mileage}
            />
            <Input
              label={t('addAuction.horsepower')}
              placeholder="e.g. 150"
              value={String(form.horsePower)}
              keyboardType="numeric"
              onChangeText={t => handleTextChange('horsePower', Number(t) || 0)}
            />
            <Input
              label={t('addAuction.engineCapacity')}
              placeholder="e.g. 1800cc"
              value={form.engineCapacity}
              onChangeText={t => handleTextChange('engineCapacity', t)}
            />
            <Input
              label={t('addAuction.engineCylinders')}
              placeholder="e.g. 4"
              value={form.engineCylinder}
              onChangeText={t => handleTextChange('engineCylinder', t)}
            />
            <Input
              label={t('addAuction.numberOfSeats')}
              placeholder="e.g. 5"
              value={String(form.noOfSeats)}
              keyboardType="numeric"
              onChangeText={t => handleTextChange('noOfSeats', Number(t) || 5)}
            />
            <Input
              label={t('addAuction.rimSize')}
              value={form.rimSize}
              onChangeText={t => handleTextChange('rimSize', t)}
              placeholder='e.g. 17"'
            />
            <Input
              label={
                <Text>
                  {t('addAuction.color')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              value={form.color}
              placeholder="e.g. Black"
              onChangeText={t => handleTextChange('color', t)}
              error={validationErrors.color}
            />
            <Input
              label={
                <Text>
                  {t('addAuction.location')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              value={form.location}
              placeholder="e.g. Dubai"
              onChangeText={t => handleTextChange('location', t)}
              error={validationErrors.location}
            />

            <Text style={styles.optionsLabel}>{t('addAuction.fuelType')}</Text>
            <MultiCheckBox
              options={fuelTypeOptions}
              selectedIds={[form.fuelType]}
              multiple={false}
              onChange={ids =>
                ids[0] && handleSingleSelect('fuelType', ids[0] as any)
              }
            />

            <Text style={styles.optionsLabel}>{t('addAuction.driveType')}</Text>
            <MultiCheckBox
              options={driveTypeOptions}
              selectedIds={[form.driveType]}
              multiple={false}
              onChange={ids =>
                ids[0] && handleSingleSelect('driveType', ids[0] as any)
              }
            />

            <Text style={styles.optionsLabel}>{t('addAuction.transmission')}</Text>
            <MultiCheckBox
              options={transmissionTypeOptions}
              selectedIds={[form.transmissionType]}
              multiple={false}
              onChange={ids =>
                ids[0] && handleSingleSelect('transmissionType', ids[0] as any)
              }
            />

            <Text style={styles.optionsLabel}>{t('addAuction.bodyType')}</Text>
            <MultiCheckBox
              options={bodyTypeOptions}
              selectedIds={[form.bodyType]}
              multiple={false}
              onChange={ids =>
                ids[0] && handleSingleSelect('bodyType', ids[0] as any)
              }
            />

            <Text style={styles.optionsLabel}>{t('addAuction.roofType')}</Text>
            <MultiCheckBox
              options={roofTypeOptions}
              selectedIds={[form.roofType]}
              multiple={false}
              onChange={ids =>
                ids[0] && handleSingleSelect('roofType', ids[0] as any)
              }
            />
          </View>
        )}

        {/* STEP 4: Seller Information */}
        {step === 4 && (
          <View style={styles.formSection}>
            <CheckBox
              label={t('addAuction.firstOwner')}
              checked={form.firstOwner}
              onToggle={() =>
                handleTextChange('firstOwner', !form.firstOwner)
              }
            />
            <Input
              label={
                <Text>
                  {t('addAuction.registrationCity')} <Text style={styles.requiredStar}>*</Text>
                </Text>
              }
              value={form.registrationCity}
              placeholder="e.g. Dubai"
              onChangeText={t => handleTextChange('registrationCity', t)}
              error={validationErrors.registrationCity}
            />
            <Input
              label={t('addAuction.sellerNationality')}
              value={form.sellerNationality}
              placeholder="e.g. UAE"
              onChangeText={t => handleTextChange('sellerNationality', t)}
            />
            <CheckBox
              label={t('addAuction.warrantyAvailable')}
              checked={form.warranty}
              onToggle={() => handleTextChange('warranty', !form.warranty)}
            />
            <CheckBox
              label={t('addAuction.serviceHistoryAvailable')}
              checked={form.serviceHistory}
              onToggle={() =>
                handleTextChange('serviceHistory', !form.serviceHistory)
              }
            />
          </View>
        )}

        {/* STEP 5: Media Upload */}
        {step === 5 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('addAuction.videoUpload')} <Text style={styles.optionalLabel}>{t('addAuction.optional')}</Text></Text>
            <Text style={styles.helperText}>
              {t('addAuction.videoMaxSize')}
            </Text>
            
            {form.videoUri ? (
              <View style={styles.uploadedMediaCard}>
                <View style={styles.uploadedMediaItem}>
                  <Play size={24} color={appColors.primary} />
                  <Text style={styles.uploadedFileName} numberOfLines={1}>
                    {t('addAuction.videoSelected')}
                  </Text>
                  <TouchableOpacity onPress={removeVideo}>
                    <X size={20} color={appColors.red} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={pickVideoFile}>
                <Upload size={24} color={appColors.primary} />
                <Text style={styles.uploadButtonText}>{t('addAuction.chooseVideo')}</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              {t('addAuction.mediaPhotos')} <Text style={styles.optionalLabel}>{t('addAuction.optional')}</Text>
            </Text>
            <Text style={styles.helperText}>
              {t('addAuction.mediaPhotosHelper')}
            </Text>

            {uploadedMediaImages.length > 0 ? (
              <View>
                <View style={styles.mediaImagesGrid}>
                  {uploadedMediaImages.map((img, idx) => (
                    <View key={idx} style={styles.mediaImageItem}>
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.mediaImage}
                      />
                      <TouchableOpacity
                        style={styles.mediaImageRemoveBtn}
                        onPress={() => removeMediaImage(idx)}
                      >
                        <X size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {uploadedMediaImages.length < 10 && (
                  <TouchableOpacity style={styles.uploadButton} onPress={pickMediaImages}>
                    <Upload size={24} color={appColors.primary} />
                    <Text style={styles.uploadButtonText}>
                      {t('addAuction.addMore')} ({uploadedMediaImages.length}/10)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={pickMediaImages}>
                <Upload size={24} color={appColors.primary} />
                <Text style={styles.uploadButtonText}>{t('addAuction.chooseImages')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 6: Documents */}
        {step === 6 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('addAuction.uploadDocuments')} <Text style={styles.optionalLabel}>{t('addAuction.optional')}</Text></Text>
            <Text style={styles.helperText}>
              {t('addAuction.documentsHelper')}
            </Text>

            {uploadedDocuments.length > 0 ? (
              <View>
                <View style={styles.documentsList}>
                  {uploadedDocuments.map((doc, idx) => (
                    <View key={idx} style={styles.documentItem}>
                      <View style={styles.documentInfo}>
                        <FileText size={20} color={appColors.primary} />
                        <Text style={styles.documentName} numberOfLines={1}>
                          {doc.name}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => removeDocument(idx)}>
                        <X size={20} color={appColors.red} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {uploadedDocuments.length < 5 && (
                  <TouchableOpacity style={styles.uploadButton} onPress={pickDocuments}>
                    <Upload size={24} color={appColors.primary} />
                    <Text style={styles.uploadButtonText}>
                      {t('addAuction.addMoreDocuments')} ({uploadedDocuments.length}/5)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocuments}>
                <Upload size={24} color={appColors.primary} />
                <Text style={styles.uploadButtonText}>{t('addAuction.chooseDocuments')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* STEP 7: Features */}
        {step === 7 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('addAuction.vehicleFeatures')}</Text>
            <MultiCheckBox
              options={featureOptions}
              selectedIds={selectedFeatureIds}
              multiple
              onChange={(ids: string[]) => {
                const newFeatures = { ...form.features };
                Object.keys(newFeatures).forEach(k => {
                  (newFeatures as any)[k] = ids.includes(k);
                });
                setForm(prev => ({ ...prev, features: newFeatures }));
                setIsDirty(true);
              }}
            />
          </View>
        )}

        {/* STEP 8: Vehicle Condition & Damage Report */}
        {step === 8 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('addAuction.step8Title')} <Text style={styles.requiredStar}>*</Text></Text>

            <View style={styles.conditionGrid}>
              {CONDITION_OPTIONS.map(condition => (
                <TouchableOpacity
                  key={condition.id}
                  style={[
                    styles.conditionCard,
                    form.vehicleCondition === condition.id &&
                      styles.conditionCardActive,
                  ]}
                  onPress={() => handleTextChange('vehicleCondition', condition.id)}
                >
                  <View
                    style={[
                      styles.conditionDot,
                      { backgroundColor: condition.color },
                    ]}
                  />
                  <Text style={styles.conditionLabel}>{condition.label}</Text>
                  <Text style={styles.conditionDescription}>
                    {condition.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Show images for all conditions, not just damage */}
            {images.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>
                  {form.vehicleCondition === 'damage' ? t('addAuction.markDamageOnImage') : t('addAuction.vehicleImages')}
                </Text>

                <View style={styles.imageSelectorRow}>
                  {images.map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.imageThumbnail,
                        selectedConditionImageIndex === idx &&
                          styles.imageThumbnailActive,
                      ]}
                      onPress={() => setSelectedConditionImageIndex(idx)}
                    >
                      <Image
                        source={{ uri: img.uri }}
                        style={styles.imageThumbnailImg}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {images[selectedConditionImageIndex] && (
                  <TouchableOpacity
                    style={styles.damageCanvasWrapper}
                    onLayout={(event: LayoutChangeEvent) => {
                      const { width, height } = event.nativeEvent.layout;
                      setDamageCanvasLayout({ width, height });
                    }}
                    onPress={(e: GestureResponderEvent) => {
                      if (form.vehicleCondition === 'damage' && damageCanvasLayout) {
                        const { locationX, locationY } = e.nativeEvent;
                        const x = locationX / damageCanvasLayout.width;
                        const y = locationY / damageCanvasLayout.height;
                        setDamageMarkerPosition({ x, y });
                      }
                    }}
                  >
                    <Image
                      source={{ uri: images[selectedConditionImageIndex].uri }}
                      style={styles.damageCanvasImage}
                    />

                    {form.damageReports?.map((report, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.damageMark,
                          {
                            left: `${report.x * 100}%`,
                            top: `${report.y * 100}%`,
                          },
                        ]}
                      >
                        <View style={styles.damageMarkCircle} />
                        <Text style={styles.damageMarkLabel}>{idx + 1}</Text>
                      </View>
                    ))}

                    {form.vehicleCondition !== 'damage' && (
                      <View style={styles.readOnlyOverlay} />
                    )}
                  </TouchableOpacity>
                )}

                {/* Damage marking controls - only show for damage condition */}
                {form.vehicleCondition === 'damage' && (
                  <>
                    <View style={styles.damageTypeRow}>
                      {[
                        t('addAuction.damageType.scratch'),
                        t('addAuction.damageType.dent'),
                        t('addAuction.damageType.paintIssue'),
                        t('addAuction.damageType.rust'),
                        t('addAuction.damageType.other'),
                      ].map(type => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.damageTypeButton,
                            currentDamageType === type &&
                              styles.damageTypeButtonActive,
                          ]}
                          onPress={() => setCurrentDamageType(type)}
                        >
                          <Text
                            style={[
                              styles.damageTypeText,
                              currentDamageType === type &&
                                styles.damageTypeTextActive,
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {damageMarkerPosition && currentDamageType && (
                      <Button
                        label={t('addAuction.addDamageMark')}
                        onPress={addDamageReport}
                        buttonStyle={styles.marginTop20}
                      />
                    )}

                    {form.damageReports && form.damageReports.length > 0 && (
                      <View style={styles.damageReportList}>
                        <Text style={styles.sectionTitle}>{t('addAuction.damageReports')}</Text>
                        {form.damageReports.map((report, idx) => (
                          <View key={idx} style={styles.damageReportItem}>
                            <Text style={styles.damageReportItemText}>
                              {idx + 1}. {report.type}
                            </Text>
                            <TouchableOpacity
                              onPress={() => removeDamageReport(idx)}
                            >
                              <Text style={styles.removeDamageText}>{t('addAuction.remove')}</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            )}

            {images.length === 0 && (
              <View style={styles.emptyStateBox}>
                <AlertCircle size={32} color={appColors.textMuted} />
                <Text style={styles.emptyStateText}>
                  {t('addAuction.photosWillAppear')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* STEP 9: Photos & Review */}
        {step === 9 && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>
              {t('addAuction.photos')} <Text style={styles.requiredStar}>*</Text>
            </Text>
            <ImagePickerField
              images={images}
              maxImages={10}
              onAddPress={pickImages}
              onRemoveImage={removeImage}
              error={validationErrors.photos}
            />

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              {t('addAuction.description')}
            </Text>
            <Input
              label={t('addAuction.description')}
              placeholder="e.g. This is a description of the car"
              value={form.description}
              onChangeText={t => handleTextChange('description', t)}
              multiline
              numberOfLines={6}
              style={styles.textArea}
            />

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              {t('addAuction.reviewSummary')}
            </Text>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewLine}>
                {form.make || '—'} {form.model || '—'} {form.year ? `(${form.year})` : ''}
              </Text>
              <Text style={styles.reviewSubLine}>
                VIN: {form.vin || '—'}
              </Text>
              <Text style={styles.reviewSubLine}>
                Location: {form.location || '—'} | Registration: {form.registrationCity || '—'}
              </Text>
              <Text style={styles.reviewSubLine}>
                Starting Price: {form.startingPrice || '—'} AED | Mileage: {form.mileage || '—'} km
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          label={step === 1 ? t('common.cancel') : t('addAuction.back')}
          variant="secondary"
          onPress={goBack}
          buttonStyle={styles.bottomButton}
        />
        <Button
          label={step === 9 ? (isEdit ? t('addAuction.updateAuction') : t('addAuction.createAuction')) : t('addAuction.continue')}
          onPress={handleNext}
          buttonStyle={styles.bottomButton}
        />
      </View>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={showStartPicker}
        date={
          form.biddingStartsAt ? new Date(form.biddingStartsAt) : new Date()
        }
        onConfirm={date => {
          setShowStartPicker(false);
          handleTextChange('biddingStartsAt', date.toISOString());
        }}
        onCancel={() => setShowStartPicker(false)}
      />

      <DatePicker
        modal
        open={showEndPicker}
        date={form.biddingEndsAt ? new Date(form.biddingEndsAt) : new Date()}
        minimumDate={
          form.biddingStartsAt ? new Date(form.biddingStartsAt) : new Date()
        }
        onConfirm={date => {
          setShowEndPicker(false);
          handleTextChange('biddingEndsAt', date.toISOString());
        }}
        onCancel={() => setShowEndPicker(false)}
      />

      <LoadingModal
        visible={saving}
        message={isEdit ? t('addAuction.updating') : t('addAuction.creating')}
      />

      <ConfirmationModal
        isVisible={modalVisible}
        title={t('addAuction.discardChanges')}
        message={t('addAuction.discardMessage')}
        confirmText={t('addAuction.yesLeave')}
        cancelText={t('addAuction.stay')}
        onConfirm={handleLeave}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}