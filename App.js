import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Card,
  CardItem,
  Icon,
  Header,
  Item,
} from 'native-base';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const firebaseAPI =
  'https://lab-terminal-fa18-bcs-055-default-rtdb.asia-southeast1.firebasedatabase.app/';

const CarsListScreen = ({ navigation }) => {
  const [carsList, setCarsList] = useState([]);

  const retrieveData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    fetch(firebaseAPI + '/cars.json', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        let data = Object.entries(result).map((item) => ({
          ...item[1],
          key: item[0],
        }));
        setCarsList(data);
      })
      .catch((error) => console.log('error', error));
  };

  const deleteData = (key) => {
    console.log('key to delete', key);
    var requestOptions = {
      method: 'DELETE',
    };

    fetch(firebaseAPI + `/cars/${key}.json`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    retrieveData();
    navigation.setOptions({
      headerTitleStyle: {
        color: 'white',
        textShadowColor: '#7c46e0',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        fontSize: 22,
      },
      headerStyle: {
        backgroundColor: 'black',
      },
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={() => navigation.navigate('Add Car')}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
            }}>
            <Ionicons name="add-outline" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      ),
      headerTintColor: 'white',
      headerTitleAlign: 'center',
    });
  }, []);

  return (
    <Container>
      <Content>
        <List
          dataArray={carsList}
          renderRow={(item) => (
            <ListItem
              onPress={() => navigation.navigate('Details', { car: item })}
              button
              avatar>
              <Left>
                <Thumbnail
                  source={{
                    uri: item.photo,
                  }}
                />
              </Left>
              <Body>
                <Text style={{ fontWeight: 'bold', marginBottom: '1%' }}>
                  {item.make} {item.model}
                </Text>
                <Text
                  note
                  style={{ fontSize: 14, color: 'gray', marginBottom: '5%' }}>
                  {item.manufacturingYear}
                </Text>
              </Body>
              <Right style={{ justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    deleteData(item.key);
                    console.log(item.key);
                  }}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </Right>
            </ListItem>
          )}></List>
      </Content>
    </Container>
  );
};

const CarDetails = ({ route, navigation }) => {
  const { car } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        color: 'white',
        textShadowColor: '#7c46e0',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        fontSize: 22,
      },
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'white',
      headerTitleAlign: 'center',
    });
  }, []);

  return (
    <View
      style={{ backgroundColor: 'white', justifyContent: 'center', flex: 1 }}>
      <Container>
        <Content padder>
          <Card>
            <CardItem cardBody>
              <Image
                source={{ uri: car.photo }}
                style={{ height: 200, width: null, flex: 1 }}
              />
            </CardItem>

            <CardItem style={{ backgroundColor: '#212121', marginTop: 2 }}>
              <Body>
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: '2%',
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {car.make} {car.model}
                </Text>
              </Body>
            </CardItem>

            <CardItem style={{ backgroundColor: '#262626', marginTop: 2 }}>
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                Details:
              </Text>
            </CardItem>

            <CardItem style={{ backgroundColor: '#262626', marginTop: 1 }}>
              <Body>
                <Text style={styles.textStyle}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>
                    Make:{' '}
                  </Text>
                  {car.make}
                </Text>

                <Text style={styles.textStyle}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>
                    Model:{' '}
                  </Text>
                  {car.model}
                </Text>

                <Text style={styles.textStyle}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>
                    Year:{' '}
                  </Text>
                  {car.manufacturingYear}
                </Text>

                <Text style={styles.textStyle}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>
                    Engine Power:{' '}
                  </Text>
                  {car.enginePower} CC
                </Text>

                <Text style={styles.textStyle}>
                  <Text style={{ fontWeight: 'bold', color: 'white' }}>
                    Color:{' '}
                  </Text>
                  {car.color}
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    </View>
  );
};

const AddCar = ({ navigation }) => {
  const [photo, setPhoto] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [manfYear, setManfYear] = useState('');
  const [enginePower, setEnginePower] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        color: 'white',
        textShadowColor: '#7c46e0',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        fontSize: 22,
      },
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'white',
      headerTitleAlign: 'center',
    });
  }, []);

  const storeData = (carObject) => {
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        photo: photo,
        make: make,
        model: model,
        manufacturingYear: manfYear,
        enginePower: enginePower,
        color: color,
      }),
    };

    fetch(firebaseAPI + '/cars.json', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log('returned', result))
      .catch((error) => console.log('error', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTextStyle}>Enter Car Details</Text>
      <TextInput
        style={styles.inputStyle}
        onChangeText={setPhoto}
        value={photo}
        placeholder="Enter Image URL"
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={setMake}
        value={make}
        placeholder="Enter Car Make"
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={setModel}
        value={model}
        placeholder="Enter Car Model"
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={(text) => {
          parseInt(text) < 2022 ? setManfYear(text) : setManfYear();
        }}
        value={manfYear}
        placeholder="Enter Manufacturing Year"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={setEnginePower}
        value={enginePower}
        placeholder="Enter Engine Power"
      />
      <TextInput
        style={styles.inputStyle}
        onChangeText={setColor}
        value={color}
        placeholder="Enter Car Color"
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          paddingVertical: '2%',
          paddingHorizontal: '4%',
          borderRadius: 2,
          marginTop: '5%',
        }}
        onPress={() => {
          storeData();
          setPhoto('');
          setMake('');
          setModel('');
          setManfYear('');
          setEnginePower('');
          setColor('');
        }}>
        <Text style={{ fontSize: 22, color: 'white' }}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const Home = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'black', color: 'white' },
      }}>
      <Stack.Screen
        name="Cars"
        component={CarsListScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Add Car')}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 2,
              }}>
              <Text style={{ fontSize: 14, color: 'white' }}>ADD</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Add Car" component={AddCar}></Stack.Screen>
      <Stack.Screen name="Details" component={CarDetails}></Stack.Screen>
    </Stack.Navigator>
  );
};

const ManageCarBrands = () => {
  const brands = [
    {
      name: 'Toyota',
      image:
        'https://global.toyota/pages/global_toyota/mobility/toyota-brand/emblem_ogp_001.png',
    },
    {
      name: 'Honda',
      image: 'https://1000logos.net/wp-content/uploads/2018/03/Honda-logo.png',
    },
    {
      name: 'Suzuki',
      image: 'https://1000logos.net/wp-content/uploads/2021/04/Suzuki-logo.png',
    },
    {
      name: 'Hyundai',
      image:
        'https://1000logos.net/wp-content/uploads/2018/04/Hyundai-logo.jpg',
    },
    {
      name: 'Kia',
      image:
        'https://i.pinimg.com/736x/03/13/a6/0313a69920a20aa54eb2e27bacd0a05f.jpg',
    },
    {
      name: 'MG',
      image:
        'https://logos-download.com/wp-content/uploads/2016/05/MG_logo_logotype.jpg',
    },
    {
      name: 'Mercedes',
      image:
        'https://i.pinimg.com/originals/03/e1/b0/03e1b0207489ad32d10b9a860ffc6623.png',
    },
    {
      name: 'BMW',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/2048px-BMW.svg.png',
    },
  ];

  return (
    <Container>
      <View
        style={{
          backgroundColor: 'black',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            padding: '5%',
            color: 'white',
            textShadowColor: '#7c46e0',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 1,
            textAlign: 'center',
            marginTop: '5%',
          }}>
          Car Brands
        </Text>
      </View>
      <FlatList
        data={brands}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{ uri: item.image }} />
            </Left>
            <Body style={{ justifyContent: 'center' }}>
              <Text style={{ paddingVertical: '3%' }}>{item.name}</Text>
            </Body>
            <Right>
              <AntDesign name="right" size={16} color="black" />
            </Right>
          </ListItem>
        )}
      />
    </Container>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerStyle={{ backgroundColor: '#4d4d4d', color: 'white' }}
        initialRouteName="Manage Cars">
        <Drawer.Screen name="Manage Cars" component={Home} />
        <Drawer.Screen name="Manage Car Brands" component={ManageCarBrands} />
      </Drawer.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerTextStyle: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: '5%',
    textAlign: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: '3%',
    borderRadius: 3,
    width: '90%',
    fontSize: 16,
    padding: 5,
  },
  textStyle: {
    fontSize: 16,
    color: '#F5F8FA',
  },
});
