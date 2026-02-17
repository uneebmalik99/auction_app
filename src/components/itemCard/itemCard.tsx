import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
  MapPin,
  Fuel,
  Gauge,
  Settings2,
  Heart,
  MoreVertical,
} from 'lucide-react-native';
import { styles } from './styles';
import { appColors } from '../../utils/appColors';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import { AuctionItem } from '../../utils/types';
import { formatRemainingTime } from '../../utils/methods';
import CountDown from '../countDown/countDown';

interface ItemCardProps {
  item?: AuctionItem;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  mark?: boolean;
  markAs?: string;
  onMarkAs?: (status: string) => void;
  messageChildren?: React.ReactNode;
}

export default function ItemCard({
  item,
  onPress,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
  mark,
  markAs,
  onMarkAs,
  messageChildren,
}: ItemCardProps) {
  const [now, setNow] = useState(Date.now());
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const content = (
    <>
      {/* Top section: avatar + main info + favorite icon */}
      <View style={styles.headerRow}>
        <View style={styles.headerMain}>
          {item?.photos?.[0] ? (
            <Image source={{ uri: item.photos[0] }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item?.title?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.title}>{item?.title}</Text>

              {onEdit ? (
                <Menu
                  visible={menuVisible}
                  onRequestClose={toggleMenu}
                  anchor={
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      activeOpacity={0.8}
                      onPress={event => {
                        event.stopPropagation();
                        toggleMenu();
                      }}
                    >
                      <MoreVertical size={18} color={appColors.textSecondary} />
                    </TouchableOpacity>
                  }
                >
                  <MenuItem
                    onPress={event => {
                      event.stopPropagation();
                      toggleMenu();
                      onEdit();
                    }}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </MenuItem>

                  <MenuDivider />
                  <MenuItem
                    onPress={event => {
                      event.stopPropagation();

                      onDelete?.();
                      toggleMenu();
                    }}
                  >
                    <Text style={styles.editText}>Delete</Text>
                  </MenuItem>

                  {mark && markAs ? (
                    <MenuItem
                      onPress={event => {
                        event.stopPropagation();
                        toggleMenu();
                        onMarkAs?.(markAs);
                      }}
                    >
                      <Text style={styles.editText}>Mark as {markAs}</Text>
                    </MenuItem>
                  ) : null}
                </Menu>
              ) : typeof isFavorite === 'boolean' && onToggleFavorite ? (
                <TouchableOpacity
                  style={styles.favoriteButton}
                  activeOpacity={0.8}
                  onPress={event => {
                    event.stopPropagation();
                    onToggleFavorite();
                  }}
                >
                  <Heart
                    size={18}
                    color={
                      isFavorite
                        ? appColors.favorite || appColors.primary
                        : appColors.textMuted
                    }
                    fill={
                      isFavorite
                        ? appColors.favorite || appColors.primary
                        : 'transparent'
                    }
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.mainValue}>{item?.startingPrice}</Text>
              {item?.currentBid ? (
                <Text style={styles.secondaryValue}>
                  {item?.currentBid || 0}
                </Text>
              ) : null}
            </View>

            {item?.location ? (
              <View style={styles.locationRow}>
                <MapPin
                  size={14}
                  color={appColors.primary}
                  style={styles.locationIcon}
                />
                <Text style={styles.metaText}>{item?.location}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Specs row (fuel, km, transmission, etc.) */}
      {(item?.fuelType || item?.mileage || item?.transmission) && (
        <View style={styles.specRow}>
          {item?.fuelType ? (
            <View style={styles.specItem}>
              <Fuel
                size={14}
                color={appColors.textSecondary}
                style={styles.specIcon}
              />
              <Text style={styles.specText}>{item?.fuelType}</Text>
            </View>
          ) : (
            <View style={styles.specItemPlaceholder} />
          )}
          {item?.mileage ? (
            <View style={styles.specItem}>
              <Gauge
                size={14}
                color={appColors.textSecondary}
                style={styles.specIcon}
              />
              <Text style={styles.specText}>{item?.mileage}</Text>
            </View>
          ) : (
            <View style={styles.specItemPlaceholder} />
          )}
          {item?.transmission ? (
            <View style={styles.specItem}>
              <Settings2
                size={14}
                color={appColors.textSecondary}
                style={styles.specIcon}
              />
              <Text style={styles.specText}>{item?.transmission}</Text>
            </View>
          ) : (
            <View style={styles.specItemPlaceholder} />
          )}
        </View>
      )}

      <View style={styles.divider} />
      {messageChildren ? messageChildren : null}
      {/* Footer row: timing info (starts/ends) or custom footer */}
      <CountDown
        biddingStartsAt={item?.biddingStartsAt}
        biddingEndsAt={item?.biddingEndsAt}
        label={true}
      />
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
}
