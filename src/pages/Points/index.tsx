import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from "../../services/api";
import * as Location from "expo-location";

// this is modeled based on the information that is returned from the API
interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Points {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

const Points = () => {
  const navigation = useNavigation();

  //states
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Points[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  // useEffect to get the current user location
  useEffect(() => {
    async function loadPosition() {
      // asks the user for authorization to use the location
      const { status } = await Location.requestPermissionsAsync();

      // if the user doesn't allow its location to be retrieved, it displays an alert
      if (status !== "granted") {
        Alert.alert(
          "Oops...",
          "You need to enable Location Services so we can determine your place on the map"
        );
        return;
      }

      // gets the user location
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  // useEffect to retrieve the items from the api
  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  // useEffect to get the points from the api
  useEffect(() => {
    api
      .get("points", {
        params: {
          city: "Cabixi",
          state: "RO",
          items: [1],
        },
      })
      .then((response) => {
        console.log(response.data);

        setPoints(response.data);
      });
  }, []);

  // function called when the user touches the back arrow at the top of the page
  function handleNavigateBack() {
    navigation.goBack();
  }

  // function called when the user touches the pin on the map. It receives the id from the touchable component and then
  // passes it through to the next page
  function handleNavigateToDetail(id: number) {
    navigation.navigate("Detail", { point_id: id });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        {/* Title and Description */}
        <Text style={styles.title}>Welcome.</Text>
        <Text style={styles.description}>Select a collection point on the map.</Text>

        {/* Map */}
        <View style={styles.mapContainer}>
          {/* 
              The next line is something line a ternary if condition, but without the else.
              In this case, if the app successfully retrieve the user location, then it displays the map
          */}
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={initialPosition[0] === 0}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      {/* Item icons */}
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {/* items.map((item) => () )  is different from items.map((item) => {} )*/}
          {/* With parenthesis you automatically return the element */}
          {items.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});

export default Points;
