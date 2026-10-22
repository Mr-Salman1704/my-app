import React, { useState } from 'react';

import {
View,
Text,
TextInput,
Image,
ScrollView,
TouchableOpacity,

StatusBar,
StyleSheet,
Alert,
KeyboardAvoidingView,
Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
const [screen, setScreen] = useState('welcome');
const [accountType, setAccountType] = useState('Buyer');
const [userName, setUserName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [search, setSearch] = useState('');
const [selectedCategory, setSelectedCategory] = useState('All');
const [products, setProducts] = useState([]);
const [favourites, setFavourites] = useState([]);
const [selectedProduct, setSelectedProduct] = useState(null);
const [businessName, setBusinessName] = useState('');
const [productName, setProductName] = useState('');
const [productPrice, setProductPrice] = useState('');
const [productDescription, setProductDescription] = useState('');
const [productCategory, setProductCategory] = useState('Clothing & Fashion');
const [productImage, setProductImage] = useState(null);
const [messages, setMessages] = useState([]);
const [currentUser, setCurrentUser] = useState(null);

const categories = [
'All',
'Clothing & Fashion',
'Phones & Electronics',
'Furniture & Home',
'Cars & Motor Parts',
'Food & Catering',
'Beauty',
'Technology & Services',
'Construction & Hardware',
'Agriculture',
'Education',
'Art & Crafts',
];

const sampleProducts = [
{
id: '1',
name: 'Fashion Collection',
price: '25',
category: 'Clothing & Fashion',
description: 'Discover fashionable clothing from Zimbabwean businesses.',
seller: 'Harare Fashion Store',
location: 'Harare',
},
{
id: '2',
name: 'Smartphone',
price: '150',
category: 'Phones & Electronics',
description: 'Explore phones and electronics offered by local sellers.',
seller: 'Tech Hub Zimbabwe',
location: 'Harare',
},
{
id: '3',
name: 'Home Furniture',
price: '80',
category: 'Furniture & Home',
description: 'Find furniture and useful items for your home.',
seller: 'HomeStyle',
location: 'Chitungwiza',
},
{
id: '4',
name: 'Beauty Products',
price: '15',
category: 'Beauty',
description: 'Browse beauty products from local businesses.',
seller: 'Beauty Corner',
location: 'Bulawayo',
},
];

const marketplaceProducts = [...sampleProducts, ...products];

const filteredProducts = marketplaceProducts.filter((product) => {
const matchesSearch =
product.name.toLowerCase().includes(search.toLowerCase()) ||
product.category.toLowerCase().includes(search.toLowerCase()) ||
product.seller.toLowerCase().includes(search.toLowerCase());

const matchesCategory =
  selectedCategory === 'All' ||
  product.category === selectedCategory;

return matchesSearch && matchesCategory;

});

const goTo = (nextScreen) => {
setScreen(nextScreen);
};

const showNotice = (title, message) => {
Alert.alert(title, message);
};

const toggleFavourite = (productId) => {
setFavourites((previous) =>
previous.includes(productId)
? previous.filter((id) => id !== productId)
: [...previous, productId]
);
};

const registerUser = () => {
if (!userName.trim() || !email.trim() || !password.trim()) {
showNotice(
'Missing information',
'Please enter your name, email and password.'
);
return;
}

if (password.length < 6) {
  showNotice(
    'Password too short',
    'Please use at least 6 characters.'
  );
  return;
}

setCurrentUser({
  name: userName.trim(),
  email: email.trim(),
  type: accountType,
  business: businessName.trim(),
});

setScreen('home');

showNotice(
  'Welcome to ZimMarket!',
  'Your demonstration profile is ready. Online account creation will be connected later.'
);

};

const signInUser = () => {
if (!email.trim() || !password.trim()) {
showNotice(
'Missing information',
'Please enter your email and password.'
);
return;
}

if (password.length < 6) {
  showNotice(
    'Check your password',
    'Please enter a password with at least 6 characters.'
  );
  return;
}

setCurrentUser({
  name: userName.trim() || 'ZimMarket User',
  email: email.trim(),
  type: accountType,
  business: businessName.trim(),
});

setScreen('home');

showNotice(
  'Welcome back!',
  'This is a demonstration sign-in. Real account verification will be added later.'
);

};
  const pickProductImage = async () => {
try {
const permission =
await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      'Permission required',
      'Allow ZimMarket to access your photos so you can upload product pictures.'
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets?.length > 0) {
    setProductImage(result.assets[0].uri);
  }
} catch (error) {
  Alert.alert(
    'Photo error',
    'We could not open your gallery. Please try again.'
  );
}

};
  const addProduct = () => {
    if (!productName.trim() || !productPrice.trim()) {
      showNotice(
        'Missing information',
        'Enter a product name and price.'
      );
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productName.trim(),
      price: productPrice.trim(),
      category: productCategory,
      image: productImage,
      description:
        productDescription.trim() || 'Contact the seller for details.',
      seller:
        currentUser?.business ||
        currentUser?.name ||
        'ZimMarket Seller',
      location: 'Zimbabwe',
    };

    setProducts((previous) => [newProduct, ...previous]);
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setProductImage(null);
    setScreen('home');

    showNotice(
      'Product added!',
      'Your product has been added to this demonstration marketplace.'
    );
  };

  const sendMessage = (product) => {
    setMessages((previous) => [
      ...previous,
      {
        id: Date.now().toString(),
        product: product.name,
        seller: product.seller,
        message: 'New enquiry about ' + product.name,
      },
    ]);

    showNotice(
      'Enquiry created',
      'Your enquiry is saved on this device for this demonstration.'
    );
  };

  const button = (label, action, primary = false) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.button,
        primary && styles.primaryButton,
      ]}
      onPress={action}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          primary && styles.primaryButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const input = (
    placeholder,
    value,
    setter,
    secure = false,
    keyboard = 'default'
  ) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#777777"
      value={value}
      onChangeText={setter}
      secureTextEntry={secure}
      keyboardType={keyboard}
      autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
    />
  );

  const heading = (title, subtitle) => (
    <View style={styles.headingArea}>
      <Text style={styles.heading}>{title}</Text>
      {!!subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#123B32"
      />

      {screen === 'welcome' ? (
        <View style={styles.welcome}>
          <View style={styles.sun} />
          <View style={styles.welcomeContent}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🛍️</Text>
            </View>

            <Text style={styles.logoTitle}>
              <Text style={styles.logoZim}>Zim</Text>
              <Text style={styles.logoMarket}>Market</Text>
            </Text>

            <Text style={styles.tagline}>
              Zimbabwean businesses.
            </Text>
            <Text style={styles.tagline}>
              One marketplace.
            </Text>

            <View style={styles.welcomeSpacer} />

            <Text style={styles.welcomeMessage}>
              Discover local businesses.{'\n'}
              Shop Zimbabwean.
            </Text>

            {button(
              'Get Started  →',
              () => goTo('account'),
              true
            )}

            {button(
              'Sign In',
              () => goTo('signin')
            )}

            <Text style={styles.footerText}>
              Proudly connecting Zimbabwe 🇿🇼
            </Text>
          </View>
        </View>
      ) : screen === 'account' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {heading(
            'Join ZimMarket',
            'First, choose the account that suits you.'
          )}

          {[
            {
              type: 'Buyer',
              emoji: '🛒',
              title: 'Buyer / Customer',
              detail:
                'Discover products, contact sellers and place orders.',
            },
            {
              type: 'Supplier',
              emoji: '📦',
              title: 'Supplier',
              detail:
                'Supply goods to retailers and other businesses.',
            },
            {
              type: 'Retailer',
              emoji: '🏪',
              title: 'Retailer',
              detail:
                'List products and sell directly to customers.',
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[
                styles.accountCard,
                accountType === item.type &&
                  styles.selectedAccountCard,
              ]}
              onPress={() => setAccountType(item.type)}
            >
              <Text style={styles.accountEmoji}>
                {item.emoji}
              </Text>

              <View style={styles.accountTextArea}>
                <Text style={styles.accountTitle}>
                  {item.title}
                </Text>
                <Text style={styles.accountDetail}>
                  {item.detail}
                </Text>
              </View>

              <Text style={styles.checkmark}>
                {accountType === item.type ? '●' : '○'}
              </Text>
            </TouchableOpacity>
          ))}

          {button(
            'Continue as ' + accountType,
            () => goTo('register'),
            true
          )}

          {button(
            'Already have an account? Sign In',
            () => goTo('signin')
          )}

          {button(
            '← Back',
            () => goTo('welcome')
          )}
        </ScrollView>
      ) : screen === 'register' ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.page}>
            {heading(
              'Create Your Account',
              'Register as a ' + accountType + '.'
            )}

            {input('Full name', userName, setUserName)}

            {input(
              'Email address',
              email,
              setEmail,
              false,
              'email-address'
            )}

            {input(
              'Password (at least 6 characters)',
              password,
              setPassword,
              true
            )}

            {accountType !== 'Buyer' &&
              input(
                'Business name',
                businessName,
                setBusinessName
              )}

            <Text style={styles.helperText}>
              Your account type: {accountType}
            </Text>

            {button(
              'Create Account',
              registerUser,
              true
            )}

            {button(
              '← Change Account Type',
              () => goTo('account')
            )}

            {button(
              'Already registered? Sign In',
              () => goTo('signin')
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : screen === 'signin' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {heading(
            'Welcome Back',
            'Sign in to continue to ZimMarket.'
          )}

          {input(
            'Email address',
            email,
            setEmail,
            false,
            'email-address'
          )}

          {input(
            'Password',
            password,
            setPassword,
            true
          )}

          {button(
            'Sign In',
            signInUser,
            true
          )}

          {button(
            'Create a New Account',
            () => goTo('account')
          )}

          {button(
            '← Back',
            () => goTo('welcome')
          )}
        </ScrollView>
              ) : screen === 'home' ? (
        <View style={styles.flex}>
          <View style={styles.homeHeader}>
            <View>
              <Text style={styles.homeLogo}>
                <Text style={styles.logoZim}>Zim</Text>
                <Text style={styles.logoMarket}>Market</Text>
              </Text>

              <Text style={styles.homeGreeting}>
                Hello, {currentUser?.name || 'there'}!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => goTo('profile')}
            >
              <Text style={styles.profileButtonText}>
                👤
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.homeContent}
          >
            <Text style={styles.marketplaceTitle}>
              Discover Zimbabwe 🇿🇼
            </Text>

            <Text style={styles.marketplaceSubtitle}>
              Find products from businesses near you.
            </Text>

            {input(
              '🔍 Search products, categories or sellers...',
              search,
              setSearch
            )}

            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionTitle}>
                Categories
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category &&
                      styles.selectedCategoryChip,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category &&
                        styles.selectedCategoryChipText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionTitle}>
                Products for You
              </Text>

              <Text style={styles.productCount}>
                {filteredProducts.length} items
              </Text>
            </View>

            {filteredProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔎</Text>
                <Text style={styles.emptyTitle}>
                  No products found
                </Text>
                <Text style={styles.emptyDescription}>
                  Try another search or category.
                </Text>
              </View>
            ) : (
              <View style={styles.productGrid}>
                {filteredProducts.map((product) => (
                  <View
                    key={product.id}
                    style={styles.productCard}
                  >
                    <TouchableOpacity
                      style={styles.productImagePlaceholder}
                      onPress={() => {
                        setSelectedProduct(product);
                        goTo('product');
                      }}
                    >
                      <Text style={styles.productEmoji}>
                        {product.category === 'Clothing & Fashion'
                          ? '👕'
                          : product.category === 'Phones & Electronics'
                          ? '📱'
                          : product.category === 'Furniture & Home'
                          ? '🛋️'
                          : product.category === 'Cars & Motor Parts'
                          ? '🚗'
                          : product.category === 'Food & Catering'
                          ? '🍲'
                          : product.category === 'Beauty'
                          ? '💄'
                          : product.category === 'Agriculture'
                          ? '🌱'
                          : product.category === 'Construction & Hardware'
                          ? '🧰'
                          : product.category === 'Education'
                          ? '📚'
                          : product.category === 'Art & Crafts'
                          ? '🎨'
                          : '💼'}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.productInfo}>
                      <Text
                        style={styles.productName}
                        numberOfLines={2}
                      >
                        {product.name}
                      </Text>

                      <Text style={styles.productPrice}>
                        US${product.price}
                      </Text>

                      <Text
                        style={styles.productSeller}
                        numberOfLines={1}
                      >
                        🏪 {product.seller}
                      </Text>

                      <Text style={styles.productLocation}>
                        📍 {product.location}
                      </Text>

                      <View style={styles.productActions}>
                        <TouchableOpacity
                          style={styles.viewProductButton}
                          onPress={() => {
                            setSelectedProduct(product);
                            goTo('product');
                          }}
                        >
                          <Text style={styles.viewProductText}>
                            View
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.favouriteButton}
                          onPress={() => toggleFavourite(product.id)}
                        >
                          <Text style={styles.favouriteText}>
                            {favourites.includes(product.id)
                              ? '❤️'
                              : '🤍'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>

          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => goTo('home')}
            >
              <Text style={styles.navEmoji}>🏠</Text>
              <Text style={styles.navActiveText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => goTo('favourites')}
            >
              <Text style={styles.navEmoji}>❤️</Text>
              <Text style={styles.navText}>Saved</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => goTo('messages')}
            >
              <Text style={styles.navEmoji}>💬</Text>
              <Text style={styles.navText}>Messages</Text>
            </TouchableOpacity>

            {accountType !== 'Buyer' && (
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => goTo('dashboard')}
              >
                <Text style={styles.navEmoji}>📊</Text>
                <Text style={styles.navText}>Business</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : screen === 'product' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {selectedProduct ? (
            <>
              {heading(
                selectedProduct.name,
                selectedProduct.category
              )}

              <View style={styles.detailImage}>
                <Text style={styles.detailEmoji}>🛍️</Text>
              </View>

              <Text style={styles.detailPrice}>
                US${selectedProduct.price}
              </Text>

              <Text style={styles.detailLabel}>
                Description
              </Text>

              <Text style={styles.detailDescription}>
                {selectedProduct.description}
              </Text>

              <Text style={styles.detailLabel}>
                Seller
              </Text>

              <Text style={styles.detailDescription}>
                🏪 {selectedProduct.seller}
              </Text>

              <Text style={styles.detailDescription}>
                📍 {selectedProduct.location}
              </Text>

              {button(
                '💬 Contact Seller',
                () => sendMessage(selectedProduct),
                true
              )}

              {button(
                favourites.includes(selectedProduct.id)
                  ? '❤️ Remove from Favourites'
                  : '🤍 Save to Favourites',
                () => toggleFavourite(selectedProduct.id)
              )}

              {button(
                '← Back to Marketplace',
                () => goTo('home')
              )}
            </>
          ) : (
            <>
              {heading('Product Details', '')}
              {button('Back', () => goTo('home'))}
            </>
          )}
        </ScrollView>
      ) : screen === 'favourites' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {heading(
            'Saved Favourites',
            'Products you have saved.'
          )}

          {marketplaceProducts
            .filter((product) =>
              favourites.includes(product.id)
            )
            .map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.savedProduct}
                onPress={() => {
                  setSelectedProduct(product);
                  goTo('product');
                }}
              >
                <Text style={styles.savedProductEmoji}>🛍️</Text>

                <View style={styles.savedProductInfo}>
                  <Text style={styles.accountTitle}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    US${product.price}
                  </Text>
                </View>

                <Text style={styles.favouriteText}>❤️</Text>
              </TouchableOpacity>
            ))}

          {favourites.length === 0 && (
            <Text style={styles.emptyDescription}>
              You haven't saved any products yet.
            </Text>
          )}

          {button(
            '← Back to Marketplace',
            () => goTo('home'),
            true
          )}
        </ScrollView>
              ) : screen === 'dashboard' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {heading(
            'Business Dashboard',
            'Manage your ZimMarket business.'
          )}

          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardEmoji}>🏪</Text>
            <Text style={styles.dashboardTitle}>
              {currentUser?.business ||
                currentUser?.name ||
                'My Business'}
            </Text>
            <Text style={styles.accountDetail}>
              Account type: {accountType}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {products.filter(
                  (product) =>
                    product.seller ===
                    (currentUser?.business ||
                      currentUser?.name ||
                      'ZimMarket Seller')
                ).length}
              </Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {messages.length}
              </Text>
              <Text style={styles.statLabel}>Enquiries</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {favourites.length}
              </Text>
              <Text style={styles.statLabel}>Saved items</Text>
            </View>
          </View>

          {button(
            '➕ Add a Product',
            () => goTo('addProduct'),
            true
          )}

          {button(
            '💬 View Enquiries',
            () => goTo('messages')
          )}

          {button(
            '🏪 Business Profile',
            () => goTo('profile')
          )}

          {button(
            '← Back to Marketplace',
            () => goTo('home')
          )}
        </ScrollView>
      ) : screen === 'addProduct' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {heading(
            'Add a Product',
            'Show Zimbabwe what your business offers.'
          )}

          {input(
            'Product name',
            productName,
            setProductName
          )}

          {input(
            'Price in US dollars',
            productPrice,
            setProductPrice,
            false,
            'decimal-pad'
          )}

          <Text style={styles.fieldLabel}>
            Product category
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories
              .filter((category) => category !== 'All')
              .map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    productCategory === category &&
                      styles.selectedCategoryChip,
                  ]}
                  onPress={() => setProductCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      productCategory === category &&
                        styles.selectedCategoryChipText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          {input(
            'Product description',
            productDescription,
            setProductDescription
          )}

          <Text style={styles.helperText}>
            Product photos and permanent online listings will
            be connected in a later development stage.
          </Text>

          {button(
            'Publish Product',
            addProduct,
            true
          )}

          {button(
            'Cancel',
            () => goTo('dashboard')
          )}
        </ScrollView>
      ) : screen === 'messages' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {heading(
            'Messages & Enquiries',
            'Keep track of product enquiries.'
          )}

          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>
                No enquiries yet
              </Text>
              <Text style={styles.emptyDescription}>
                Contact a seller from a product page to create
                a demonstration enquiry.
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={styles.messageCard}
              >
                <Text style={styles.messageEmoji}>💬</Text>

                <View style={styles.messageInfo}>
                  <Text style={styles.accountTitle}>
                    {message.seller}
                  </Text>

                  <Text style={styles.accountDetail}>
                    {message.product}
                  </Text>

                  <Text style={styles.messageText}>
                    {message.message}
                  </Text>
                </View>
              </View>
            ))
          )}

          {button(
            'Browse Marketplace',
            () => goTo('home'),
            true
          )}

          {button(
            'Back to Dashboard',
            () => goTo('dashboard')
          )}
        </ScrollView>
      ) : screen === 'profile' ? (
        <ScrollView contentContainerStyle={styles.page}>
          {heading(
            'My Profile',
            'Your ZimMarket account.'
          )}

          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>👤</Text>
            </View>

            <Text style={styles.dashboardTitle}>
              {currentUser?.name || 'ZimMarket User'}
            </Text>

            <Text style={styles.accountDetail}>
              {currentUser?.email || email}
            </Text>

            <View style={styles.accountBadge}>
              <Text style={styles.accountBadgeText}>
                {currentUser?.type || accountType}
              </Text>
            </View>
          </View>

          {(currentUser?.type || accountType) !== 'Buyer' && (
            <>
              <Text style={styles.detailLabel}>
                Business name
              </Text>

              <Text style={styles.detailDescription}>
                {currentUser?.business ||
                  'No business name added.'}
              </Text>

              {button(
                '📊 Business Dashboard',
                () => goTo('dashboard'),
                true
              )}

              {button(
                '➕ Add a Product',
                () => goTo('addProduct')
              )}
            </>
          )}

          {button(
            'Change Account Type',
            () => {
              Alert.alert(
                'Change account type',
                'Choose how you want to continue.',
                [
                  {
                    text: 'Buyer',
                    onPress: () => {
                      setAccountType('Buyer');
                      setCurrentUser((previous) =>
                        previous
                          ? { ...previous, type: 'Buyer' }
                          : null
                      );
                    },
                  },
                  {
                    text: 'Supplier',
                    onPress: () => {
                      setAccountType('Supplier');
                      setCurrentUser((previous) =>
                        previous
                          ? { ...previous, type: 'Supplier' }
                          : null
                      );
                    },
                  },
                  {
                    text: 'Retailer',
                    onPress: () => {
                      setAccountType('Retailer');
                      setCurrentUser((previous) =>
                        previous
                          ? { ...previous, type: 'Retailer' }
                          : null
                      );
                    },
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ]
              );
            }
          )}

          {button(
            '← Back to Marketplace',
            () => goTo('home')
          )}

          {button(
            'Sign Out',
            () => {
              Alert.alert(
                'Sign out',
                'Do you want to leave this account?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Sign Out',
                    onPress: () => {
                      setCurrentUser(null);
                      setUserName('');
                      setEmail('');
                      setPassword('');
                      setBusinessName('');
                      setSearch('');
                      setSelectedCategory('All');
                      setScreen('welcome');
                    },
                  },
                ]
              );
            }
          )}
        </ScrollView>
      ) : (
        <View style={styles.page}>
          {heading(
            'ZimMarket',
            'Welcome to the marketplace.'
          )}

          {button(
            'Return to Home',
            () => goTo('home'),
            true
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },

  flex: {
    flex: 1,
  },

  welcome: {
    flex: 1,
    backgroundColor: '#E7B67A',
    overflow: 'hidden',
  },

  sun: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#FFD66B',
    top: 65,
    right: -65,
    opacity: 0.95,
  },

  welcomeContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 75,
    paddingBottom: 25,
    backgroundColor: 'rgba(24, 72, 57, 0.16)',
  },

  logoIcon: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  logoEmoji: {
    fontSize: 35,
  },

  logoTitle: {
    fontSize: 39,
    fontWeight: '900',
    letterSpacing: -1.5,
  },

  logoZim: {
    color: '#123B32',
  },

  logoMarket: {
    color: '#F4BD32',
  },

  tagline: {
    fontSize: 17,
    color: '#173D32',
    fontWeight: '600',
    marginTop: 4,
  },

  welcomeSpacer: {
    flex: 1,
    minHeight: 55,
  },

  welcomeMessage: {
    color: '#173D32',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 33,
    marginBottom: 24,
  },

  button: {
    minHeight: 51,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#D7DED8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginTop: 11,
  },

  primaryButton: {
    backgroundColor: '#F4C430',
    borderColor: '#F4C430',
  },

  buttonText: {
    fontSize: 15,
    color: '#173D32',
    fontWeight: '700',
    textAlign: 'center',
  },

  primaryButtonText: {
    color: '#173D32',
    fontWeight: '900',
  },

  footerText: {
    textAlign: 'center',
    color: '#173D32',
    fontSize: 12,
    marginTop: 18,
    fontWeight: '600',
  },

  page: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 35,
  },

  headingArea: {
    marginBottom: 22,
  },

  heading: {
    color: '#173D32',
    fontSize: 27,
    fontWeight: '900',
    marginBottom: 7,
  },

  subtitle: {
    color: '#6B756F',
    fontSize: 14,
    lineHeight: 21,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#DCE3DC',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#173D32',
    fontSize: 14,
    marginBottom: 13,
  },

  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E6E0',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },

  selectedAccountCard: {
    borderColor: '#E5B92E',
    backgroundColor: '#FFF9E5',
  },

  accountEmoji: {
    fontSize: 30,
    marginRight: 13,
  },

  accountTextArea: {
    flex: 1,
  },

  accountTitle: {
    color: '#173D32',
    fontSize: 15,
    fontWeight: '800',
  },

  accountDetail: {
    color: '#737D76',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  checkmark: {
    color: '#C59A13',
    fontSize: 22,
    marginLeft: 8,
  },

  helperText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#737D76',
    marginTop: 8,
    marginBottom: 7,
  },

  homeHeader: {
    backgroundColor: '#123B32',
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  homeLogo: {
    fontSize: 28,
    fontWeight: '900',
  },

  homeGreeting: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 7,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileButtonText: {
    fontSize: 23,
  },

  homeContent: {
    padding: 18,
    paddingBottom: 30,
  },

  marketplaceTitle: {
    color: '#173D32',
    fontSize: 23,
    fontWeight: '900',
  },

  marketplaceSubtitle: {
    color: '#747E77',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 18,
  },

  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#173D32',
  },

  productCount: {
    color: '#737D76',
    fontSize: 12,
  },

  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E5DF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 7,
  },

  selectedCategoryChip: {
    backgroundColor: '#123B32',
    borderColor: '#123B32',
  },

  categoryChipText: {
    color: '#45564B',
    fontSize: 12,
    fontWeight: '600',
  },

  selectedCategoryChipText: {
    color: '#FFFFFF',
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E8EBE6',
  },

  productImagePlaceholder: {
    height: 115,
    backgroundColor: '#EAF0E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  productEmoji: {
    fontSize: 43,
  },

  productInfo: {
    padding: 11,
  },

  productName: {
    color: '#173D32',
    fontSize: 13,
    fontWeight: '800',
    minHeight: 34,
  },

  productPrice: {
    color: '#B38706',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 7,
  },

  productSeller: {
    color: '#69766D',
    fontSize: 10,
    marginTop: 8,
  },

  productLocation: {
    color: '#69766D',
    fontSize: 10,
    marginTop: 5,
  },

  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  viewProductButton: {
    flex: 1,
    backgroundColor: '#123B32',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },

  viewProductText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  favouriteButton: {
    width: 37,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  favouriteText: {
    fontSize: 19,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 18,
  },

  emptyEmoji: {
    fontSize: 43,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#173D32',
    marginBottom: 7,
  },

  emptyDescription: {
    color: '#737D76',
    textAlign: 'center',
    lineHeight: 21,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 15,
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E8E2',
    paddingTop: 10,
    paddingBottom: 10,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
  },

  navEmoji: {
    fontSize: 20,
  },

  navText: {
    color: '#737D76',
    fontSize: 10,
    marginTop: 4,
  },

  navActiveText: {
    color: '#123B32',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
  },

  bottomSpacing: {
    height: 15,
  },

  detailImage: {
    height: 190,
    backgroundColor: '#EAF0E9',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  detailEmoji: {
    fontSize: 75,
  },

  detailPrice: {
    color: '#B38706',
    fontSize: 27,
    fontWeight: '900',
    marginBottom: 22,
  },

  detailLabel: {
    color: '#173D32',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 6,
  },

  detailDescription: {
    color: '#657169',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 5,
  },

  savedProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EBE6',
  },

  savedProductEmoji: {
    fontSize: 30,
    marginRight: 13,
  },

  savedProductInfo: {
    flex: 1,
  },

  dashboardCard: {
    backgroundColor: '#123B32',
    borderRadius: 17,
    padding: 23,
    alignItems: 'center',
    marginBottom: 18,
  },

  dashboardEmoji: {
    fontSize: 40,
    marginBottom: 9,
  },

  dashboardTitle: {
    color: '#173D32',
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 5,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE3',
    borderRadius: 12,
    width: '31%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },

  statNumber: {
    color: '#B38706',
    fontSize: 22,
    fontWeight: '900',
  },

  statLabel: {
    color: '#69766D',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },

  fieldLabel: {
    color: '#173D32',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5,
    marginBottom: 9,
  },

  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5EAE3',
  },

  messageEmoji: {
    fontSize: 26,
    marginRight: 12,
  },

  messageInfo: {
    flex: 1,
  },

  messageText: {
    color: '#737D76',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },

  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE3',
    borderRadius: 17,
    padding: 23,
    marginBottom: 22,
  },

  profileAvatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#EAF0E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  profileAvatarText: {
    fontSize: 38,
  },

  accountBadge: {
    backgroundColor: '#FFF3C7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginTop: 12,
  },

  accountBadgeText: {
    color: '#80620A',
    fontWeight: '800',
    fontSize: 12,
  },
});