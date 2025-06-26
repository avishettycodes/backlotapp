import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSwipeQueueStore } from '../store/swipeQueueStore';
import { Car } from '../types/car';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 375;
const scaledFontSize = (size: number) => size * scale;
const scaledSize = (size: number) => size * scale;

// Form validation schema
const validationSchema = Yup.object({
  year: Yup.number().min(1900).max(new Date().getFullYear()).required('Year is required'),
  make: Yup.string().required('Make is required'),
  model: Yup.string().required('Model is required'),
  trim: Yup.string(),
  mileage: Yup.number().min(0).required('Mileage is required'),
  transmission: Yup.string().oneOf(['Automatic', 'Manual', 'CVT']).required('Transmission is required'),
  fuelType: Yup.string().oneOf(['Gasoline', 'Diesel', 'Hybrid', 'Electric']).required('Fuel type is required'),
  seats: Yup.number().min(1).max(15).required('Number of seats is required'),
  exteriorColor: Yup.string().required('Exterior color is required'),
  interiorColor: Yup.string().required('Interior color is required'),
  titleStatus: Yup.string().oneOf(['Clean', 'Salvage', 'Rebuilt', 'Lien']).required('Title status is required'),
  location: Yup.string().required('Location is required'),
  price: Yup.number().min(0).required('Price is required'),
  images: Yup.array().min(1, 'Upload at least one photo').max(10),
  description: Yup.string().max(500, 'Description must be 500 characters or less'),
  pros: Yup.array().of(Yup.string()),
  cons: Yup.array().of(Yup.string()),
  sellerName: Yup.string().required('Seller name is required'),
  sellerContact: Yup.string().email('Valid email is required').required('Contact email is required'),
});

// Initial form values
const initialValues = {
  year: '',
  make: '',
  model: '',
  trim: '',
  mileage: '',
  transmission: '',
  fuelType: '',
  seats: '',
  exteriorColor: '',
  interiorColor: '',
  titleStatus: '',
  location: '',
  price: '',
  images: [] as string[],
  description: '',
  pros: [''],
  cons: [''],
  sellerName: '',
  sellerContact: '',
};

const transmissionOptions = ['Automatic', 'Manual', 'CVT'];
const fuelTypeOptions = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
const titleStatusOptions = ['Clean', 'Salvage', 'Rebuilt', 'Lien'];

export default function Submit() {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initializeQueue } = useSwipeQueueStore();

  const totalSteps = 5;

  const requestImagePickerPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return false;
      }
    }
    return true;
  };

  const pickImages = async (setFieldValue: any, values: any) => {
    const hasPermission = await requestImagePickerPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      const updatedImages = [...values.images, ...newImages].slice(0, 10);
      setFieldValue('images', updatedImages);
    }
  };

  const removeImage = (setFieldValue: any, values: any, index: number) => {
    const updatedImages = values.images.filter((_: string, i: number) => i !== index);
    setFieldValue('images', updatedImages);
  };

  const addProCon = (setFieldValue: any, values: any, field: 'pros' | 'cons') => {
    const updatedArray = [...values[field], ''];
    setFieldValue(field, updatedArray);
  };

  const removeProCon = (setFieldValue: any, values: any, field: 'pros' | 'cons', index: number) => {
    const updatedArray = values[field].filter((_: string, i: number) => i !== index);
    setFieldValue(field, updatedArray);
  };

  const updateProCon = (setFieldValue: any, values: any, field: 'pros' | 'cons', index: number, value: string) => {
    const updatedArray = [...values[field]];
    updatedArray[index] = value;
    setFieldValue(field, updatedArray);
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Create new car object
      const newCar: Car = {
        id: Date.now(),
        year: parseInt(values.year),
        make: values.make,
        model: values.model,
        trim: values.trim,
        mileage: parseInt(values.mileage),
        transmission: values.transmission,
        fuelType: values.fuelType,
        seats: parseInt(values.seats),
        exteriorColor: values.exteriorColor,
        interiorColor: values.interiorColor,
        titleStatus: values.titleStatus,
        location: values.location,
        price: parseInt(values.price),
        image: values.images[0] || '',
        images: values.images,
        description: values.description,
        pros: values.pros.filter((pro: string) => pro.trim()),
        cons: values.cons.filter((con: string) => con.trim()),
        sellerName: values.sellerName,
        sellerContact: values.sellerContact,
        listedDate: new Date().toISOString(),
      };

      // Add to queue (simulating API call)
      initializeQueue([newCar]);
      
      Alert.alert('Success!', 'Car listed successfully!', [
        { text: 'OK', onPress: () => setCurrentStep(1) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit car listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text style={[styles.stepText, { color: colors.text }]}>
        Step {currentStep} of {totalSteps}
      </Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${(currentStep / totalSteps) * 100}%`,
              backgroundColor: colors.primary 
            }
          ]} 
        />
      </View>
    </View>
  );

  const renderBasicInfo = (values: any, setFieldValue: any, errors: any, touched: any) => (
    <View style={styles.step}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Basic Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Year *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.year && touched.year ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.year}
          onChangeText={(text) => setFieldValue('year', text)}
          placeholder="2020"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          accessibilityLabel="Car year"
        />
        {errors.year && touched.year && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.year}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Make *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.make && touched.make ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.make}
          onChangeText={(text) => setFieldValue('make', text)}
          placeholder="Toyota"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Car make"
        />
        {errors.make && touched.make && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.make}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Model *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.model && touched.model ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.model}
          onChangeText={(text) => setFieldValue('model', text)}
          placeholder="Camry"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Car model"
        />
        {errors.model && touched.model && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.model}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Trim</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text 
            }
          ]}
          value={values.trim}
          onChangeText={(text) => setFieldValue('trim', text)}
          placeholder="SE, XLE, etc."
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Car trim"
        />
      </View>
    </View>
  );

  const renderSpecs = (values: any, setFieldValue: any, errors: any, touched: any) => (
    <View style={styles.step}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Specifications</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Mileage *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.mileage && touched.mileage ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.mileage}
          onChangeText={(text) => setFieldValue('mileage', text)}
          placeholder="50000"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          accessibilityLabel="Car mileage"
        />
        {errors.mileage && touched.mileage && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.mileage}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Transmission *</Text>
        <View style={styles.optionsContainer}>
          {transmissionOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                {
                  backgroundColor: values.transmission === option ? colors.primary : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setFieldValue('transmission', option)}
              accessibilityLabel={`Select ${option} transmission`}
            >
              <Text style={[
                styles.optionText,
                { color: values.transmission === option ? colors.textInverse : colors.text }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.transmission && touched.transmission && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.transmission}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Fuel Type *</Text>
        <View style={styles.optionsContainer}>
          {fuelTypeOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                {
                  backgroundColor: values.fuelType === option ? colors.primary : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setFieldValue('fuelType', option)}
              accessibilityLabel={`Select ${option} fuel type`}
            >
              <Text style={[
                styles.optionText,
                { color: values.fuelType === option ? colors.textInverse : colors.text }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.fuelType && touched.fuelType && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.fuelType}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Number of Seats *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.seats && touched.seats ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.seats}
          onChangeText={(text) => setFieldValue('seats', text)}
          placeholder="5"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          accessibilityLabel="Number of seats"
        />
        {errors.seats && touched.seats && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.seats}</Text>
        )}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: scaledSize(10) }]}>
          <Text style={[styles.label, { color: colors.text }]}>Exterior Color *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card,
                borderColor: errors.exteriorColor && touched.exteriorColor ? colors.error : colors.border,
                color: colors.text 
              }
            ]}
            value={values.exteriorColor}
            onChangeText={(text) => setFieldValue('exteriorColor', text)}
            placeholder="White"
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Exterior color"
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: scaledSize(10) }]}>
          <Text style={[styles.label, { color: colors.text }]}>Interior Color *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card,
                borderColor: errors.interiorColor && touched.interiorColor ? colors.error : colors.border,
                color: colors.text 
              }
            ]}
            value={values.interiorColor}
            onChangeText={(text) => setFieldValue('interiorColor', text)}
            placeholder="Black"
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Interior color"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Title Status *</Text>
        <View style={styles.optionsContainer}>
          {titleStatusOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                {
                  backgroundColor: values.titleStatus === option ? colors.primary : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setFieldValue('titleStatus', option)}
              accessibilityLabel={`Select ${option} title status`}
            >
              <Text style={[
                styles.optionText,
                { color: values.titleStatus === option ? colors.textInverse : colors.text }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.titleStatus && touched.titleStatus && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.titleStatus}</Text>
        )}
      </View>
    </View>
  );

  const renderLocationPrice = (values: any, setFieldValue: any, errors: any, touched: any) => (
    <View style={styles.step}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Location & Price</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Location *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.location && touched.location ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.location}
          onChangeText={(text) => setFieldValue('location', text)}
          placeholder="Austin, TX"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Car location"
        />
        {errors.location && touched.location && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.location}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Price *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.price && touched.price ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.price}
          onChangeText={(text) => setFieldValue('price', text)}
          placeholder="25000"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          accessibilityLabel="Car price"
        />
        {errors.price && touched.price && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.price}</Text>
        )}
      </View>

      {values.price && (
        <View style={[styles.priceEstimate, { backgroundColor: colors.card }]}>
          <Ionicons name="calculator-outline" size={20} color={colors.primary} />
          <Text style={[styles.priceEstimateText, { color: colors.text }]}>
            Estimated value: ${parseInt(values.price || '0').toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );

  const renderPhotosDescription = (values: any, setFieldValue: any, errors: any, touched: any) => (
    <View style={styles.step}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Photos & Description</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Photos *</Text>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          onPress={() => pickImages(setFieldValue, values)}
          accessibilityLabel="Upload photos"
        >
          <Ionicons name="camera-outline" size={24} color={colors.textInverse} />
          <Text style={[styles.uploadButtonText, { color: colors.textInverse }]}>
            Upload Photos ({values.images.length}/10)
          </Text>
        </TouchableOpacity>
        {errors.images && touched.images && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.images}</Text>
        )}
      </View>

      {values.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {values.images.map((image: string, index: number) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.thumbnail} />
              <TouchableOpacity
                style={[styles.removeImageButton, { backgroundColor: colors.error }]}
                onPress={() => removeImage(setFieldValue, values, index)}
                accessibilityLabel={`Remove image ${index + 1}`}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[
            styles.textArea,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text 
            }
          ]}
          value={values.description}
          onChangeText={(text) => setFieldValue('description', text)}
          placeholder="Describe your car..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          accessibilityLabel="Car description"
        />
        <Text style={[styles.charCount, { color: colors.textSecondary }]}>
          {values.description.length}/500
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Pros</Text>
        {values.pros.map((pro: string, index: number) => (
          <View key={index} style={styles.proConRow}>
            <TextInput
              style={[
                styles.proConInput,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              value={pro}
              onChangeText={(text) => updateProCon(setFieldValue, values, 'pros', index, text)}
              placeholder="Add a pro..."
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel={`Pro ${index + 1}`}
            />
            <TouchableOpacity
              style={[styles.removeProConButton, { backgroundColor: colors.error }]}
              onPress={() => removeProCon(setFieldValue, values, 'pros', index)}
              accessibilityLabel={`Remove pro ${index + 1}`}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={[styles.addProConButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => addProCon(setFieldValue, values, 'pros')}
          accessibilityLabel="Add pro"
        >
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={[styles.addProConText, { color: colors.primary }]}>Add Pro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Cons</Text>
        {values.cons.map((con: string, index: number) => (
          <View key={index} style={styles.proConRow}>
            <TextInput
              style={[
                styles.proConInput,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              value={con}
              onChangeText={(text) => updateProCon(setFieldValue, values, 'cons', index, text)}
              placeholder="Add a con..."
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel={`Con ${index + 1}`}
            />
            <TouchableOpacity
              style={[styles.removeProConButton, { backgroundColor: colors.error }]}
              onPress={() => removeProCon(setFieldValue, values, 'cons', index)}
              accessibilityLabel={`Remove con ${index + 1}`}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={[styles.addProConButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => addProCon(setFieldValue, values, 'cons')}
          accessibilityLabel="Add con"
        >
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={[styles.addProConText, { color: colors.primary }]}>Add Con</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSellerInfo = (values: any, setFieldValue: any, errors: any, touched: any) => (
    <View style={styles.step}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Seller Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Seller Name *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.sellerName && touched.sellerName ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.sellerName}
          onChangeText={(text) => setFieldValue('sellerName', text)}
          placeholder="John Doe"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Seller name"
        />
        {errors.sellerName && touched.sellerName && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.sellerName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Contact Email *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card,
              borderColor: errors.sellerContact && touched.sellerContact ? colors.error : colors.border,
              color: colors.text 
            }
          ]}
          value={values.sellerContact}
          onChangeText={(text) => setFieldValue('sellerContact', text)}
          placeholder="john@example.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Contact email"
        />
        {errors.sellerContact && touched.sellerContact && (
          <Text style={[styles.errorText, { color: colors.error }]}>{errors.sellerContact}</Text>
        )}
      </View>
    </View>
  );

  const renderReview = (values: any) => (
    <View style={styles.step}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Review & Submit</Text>
      
      <ScrollView style={styles.reviewContainer}>
        <View style={[styles.reviewCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Basic Information</Text>
          <Text style={[styles.reviewText, { color: colors.text }]}>
            {values.year} {values.make} {values.model} {values.trim}
          </Text>
          
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Specifications</Text>
          <Text style={[styles.reviewText, { color: colors.text }]}>
            {values.mileage} miles • {values.transmission} • {values.fuelType} • {values.seats} seats
          </Text>
          <Text style={[styles.reviewText, { color: colors.text }]}>
            {values.exteriorColor} exterior • {values.interiorColor} interior • {values.titleStatus} title
          </Text>
          
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Location & Price</Text>
          <Text style={[styles.reviewText, { color: colors.text }]}>
            {values.location} • ${parseInt(values.price || '0').toLocaleString()}
          </Text>
          
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Photos</Text>
          <Text style={[styles.reviewText, { color: colors.text }]}>
            {values.images.length} photo{values.images.length !== 1 ? 's' : ''} uploaded
          </Text>
          
          {values.description && (
            <>
              <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Description</Text>
              <Text style={[styles.reviewText, { color: colors.text }]}>{values.description}</Text>
            </>
          )}
          
          {values.pros.filter((pro: string) => pro.trim()).length > 0 && (
            <>
              <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Pros</Text>
              {values.pros.filter((pro: string) => pro.trim()).map((pro: string, index: number) => (
                <Text key={index} style={[styles.reviewText, { color: colors.text }]}>• {pro}</Text>
              ))}
            </>
          )}
          
          {values.cons.filter((con: string) => con.trim()).length > 0 && (
            <>
              <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Cons</Text>
              {values.cons.filter((con: string) => con.trim()).map((con: string, index: number) => (
                <Text key={index} style={[styles.reviewText, { color: colors.text }]}>• {con}</Text>
              ))}
            </>
          )}
          
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>Seller Information</Text>
          <Text style={[styles.reviewText, { color: colors.text }]}>
            {values.sellerName} • {values.sellerContact}
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderCurrentStep = (values: any, setFieldValue: any, errors: any, touched: any) => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo(values, setFieldValue, errors, touched);
      case 2:
        return renderSpecs(values, setFieldValue, errors, touched);
      case 3:
        return renderLocationPrice(values, setFieldValue, errors, touched);
      case 4:
        return renderPhotosDescription(values, setFieldValue, errors, touched);
      case 5:
        return renderSellerInfo(values, setFieldValue, errors, touched);
      default:
        return null;
    }
  };

  const getStepErrors = (errors: any, touched: any) => {
    switch (currentStep) {
      case 1:
        return !!(errors.year && touched.year) || !!(errors.make && touched.make) || !!(errors.model && touched.model);
      case 2:
        return !!(errors.mileage && touched.mileage) || !!(errors.transmission && touched.transmission) || 
               !!(errors.fuelType && touched.fuelType) || !!(errors.seats && touched.seats) || 
               !!(errors.exteriorColor && touched.exteriorColor) || !!(errors.interiorColor && touched.interiorColor) || 
               !!(errors.titleStatus && touched.titleStatus);
      case 3:
        return !!(errors.location && touched.location) || !!(errors.price && touched.price);
      case 4:
        return !!(errors.images && touched.images);
      case 5:
        return !!(errors.sellerName && touched.sellerName) || !!(errors.sellerContact && touched.sellerContact);
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched, handleSubmit, isValid }) => (
          <>
            {renderStepIndicator()}
            
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderCurrentStep(values, setFieldValue, errors, touched)}
              
              {currentStep === 5 && renderReview(values)}
            </ScrollView>

            <View style={[styles.navigation, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.backButton, { borderColor: colors.border }]}
                  onPress={() => setCurrentStep(currentStep - 1)}
                  accessibilityLabel="Go to previous step"
                >
                  <Ionicons name="chevron-back" size={20} color={colors.text} />
                  <Text style={[styles.navButtonText, { color: colors.text }]}>Back</Text>
                </TouchableOpacity>
              )}

              {currentStep < totalSteps ? (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.nextButton,
                    { 
                      backgroundColor: getStepErrors(errors, touched) ? colors.textTertiary : colors.primary,
                      opacity: getStepErrors(errors, touched) ? 0.5 : 1
                    }
                  ]}
                  onPress={() => setCurrentStep(currentStep + 1)}
                  disabled={getStepErrors(errors, touched)}
                  accessibilityLabel="Go to next step"
                >
                  <Text style={[styles.navButtonText, { color: colors.textInverse }]}>Next</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textInverse} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.submitButton,
                    { 
                      backgroundColor: isSubmitting ? colors.textTertiary : colors.primary,
                      opacity: isSubmitting ? 0.5 : 1
                    }
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || !isValid}
                  accessibilityLabel="Submit car listing"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.textInverse} size="small" />
                  ) : (
                    <>
                      <Text style={[styles.navButtonText, { color: colors.textInverse }]}>Submit</Text>
                      <Ionicons name="checkmark" size={20} color={colors.textInverse} />
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepIndicator: {
    paddingHorizontal: scaledSize(20),
    paddingVertical: scaledSize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stepText: {
    fontSize: scaledFontSize(16),
    fontWeight: '600',
    marginBottom: scaledSize(8),
  },
  progressBar: {
    height: scaledSize(4),
    backgroundColor: '#e0e0e0',
    borderRadius: scaledSize(2),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: scaledSize(2),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scaledSize(100),
  },
  step: {
    padding: scaledSize(20),
  },
  stepTitle: {
    fontSize: scaledFontSize(24),
    fontWeight: 'bold',
    marginBottom: scaledSize(24),
  },
  inputGroup: {
    marginBottom: scaledSize(20),
  },
  label: {
    fontSize: scaledFontSize(16),
    fontWeight: '600',
    marginBottom: scaledSize(8),
  },
  input: {
    height: scaledSize(48),
    borderWidth: 1,
    borderRadius: scaledSize(8),
    paddingHorizontal: scaledSize(16),
    fontSize: scaledFontSize(16),
  },
  textArea: {
    height: scaledSize(100),
    borderWidth: 1,
    borderRadius: scaledSize(8),
    paddingHorizontal: scaledSize(16),
    paddingVertical: scaledSize(12),
    fontSize: scaledFontSize(16),
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: scaledFontSize(12),
    textAlign: 'right',
    marginTop: scaledSize(4),
  },
  errorText: {
    fontSize: scaledFontSize(12),
    marginTop: scaledSize(4),
  },
  row: {
    flexDirection: 'row',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledSize(8),
  },
  optionButton: {
    paddingHorizontal: scaledSize(16),
    paddingVertical: scaledSize(12),
    borderRadius: scaledSize(8),
    borderWidth: 1,
    minWidth: scaledSize(100),
    alignItems: 'center',
  },
  optionText: {
    fontSize: scaledFontSize(14),
    fontWeight: '500',
  },
  priceEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scaledSize(16),
    borderRadius: scaledSize(8),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: scaledSize(8),
  },
  priceEstimateText: {
    fontSize: scaledFontSize(14),
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaledSize(16),
    borderRadius: scaledSize(8),
    gap: scaledSize(8),
  },
  uploadButtonText: {
    fontSize: scaledFontSize(16),
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: scaledSize(20),
  },
  imageWrapper: {
    position: 'relative',
    marginRight: scaledSize(12),
  },
  thumbnail: {
    width: scaledSize(80),
    height: scaledSize(80),
    borderRadius: scaledSize(8),
  },
  removeImageButton: {
    position: 'absolute',
    top: -scaledSize(4),
    right: -scaledSize(4),
    width: scaledSize(20),
    height: scaledSize(20),
    borderRadius: scaledSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  proConRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledSize(8),
    gap: scaledSize(8),
  },
  proConInput: {
    flex: 1,
    height: scaledSize(40),
    borderWidth: 1,
    borderRadius: scaledSize(8),
    paddingHorizontal: scaledSize(12),
    fontSize: scaledFontSize(14),
  },
  removeProConButton: {
    width: scaledSize(32),
    height: scaledSize(32),
    borderRadius: scaledSize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProConButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaledSize(12),
    borderRadius: scaledSize(8),
    borderWidth: 1,
    gap: scaledSize(8),
  },
  addProConText: {
    fontSize: scaledFontSize(14),
    fontWeight: '500',
  },
  reviewContainer: {
    maxHeight: scaledSize(400),
  },
  reviewCard: {
    padding: scaledSize(20),
    borderRadius: scaledSize(12),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reviewSectionTitle: {
    fontSize: scaledFontSize(18),
    fontWeight: 'bold',
    marginTop: scaledSize(16),
    marginBottom: scaledSize(8),
  },
  reviewText: {
    fontSize: scaledFontSize(16),
    marginBottom: scaledSize(4),
    lineHeight: scaledSize(24),
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaledSize(20),
    paddingVertical: scaledSize(16),
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaledSize(24),
    paddingVertical: scaledSize(12),
    borderRadius: scaledSize(8),
    minHeight: scaledSize(44),
    gap: scaledSize(8),
  },
  backButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  nextButton: {
    flex: 1,
    marginLeft: scaledSize(12),
  },
  submitButton: {
    flex: 1,
    marginLeft: scaledSize(12),
  },
  navButtonText: {
    fontSize: scaledFontSize(16),
    fontWeight: '600',
  },
}); 