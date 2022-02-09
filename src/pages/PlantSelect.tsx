import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { EnviromentButton } from "../components/EnviromentButton";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from '../components/Load';
import { PlantProps } from "../libs/storage";

import api from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnviromentProps {
    key: string;
    title: string;
}

export function PlantSelect() {
    const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
    const [plants, setplants] = useState<PlantProps[]>([]);
    const [filteredPlants, setfilteredPlants] = useState<PlantProps[]>([]);
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navegation = useNavigation();

    function handleEnviromentSelected(environment: string) {
        setEnviromentSelected(environment);

        if (environment == 'all')
            return setfilteredPlants(plants);

        const filtered = plants.filter(plant =>
            plant.environments.includes(environment)
        );

        setfilteredPlants(filtered);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1)
            return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    function handlePlantSelect(plant: PlantProps){
        navegation.navigate('PlantSave', { plant })
    }

    const fetchEnviroment = useCallback(async () => {
        const { data } = await api
            .get('plants_environments?_sort=title&_order=asc');
        setEnviroments([
            {
                key: 'all',
                title: 'Todos',
            },
            ...data
        ]);
    }, [])

    async function fetchPlants() {
        const { data } = await api
            .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if (!data)
            return setLoading(true);

        if (page > 1) {
            setplants(oldValue => [...oldValue, ...data])
            setfilteredPlants(oldValue => [...oldValue, ...data])
        } else {
            setplants(data);
            setfilteredPlants(data);
        }
        setLoading(false);
        setLoadingMore(false);
    }
    //Caso adicionar mais algum useEffect, criar a const conforme acima e adicionar na chamada abaixo
    useEffect(() => {
        fetchEnviroment();
        fetchPlants();
    }, [fetchEnviroment])

    if (loading)
        return <Load />
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList
                    data={enviroments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                {/* <Text>
                    {JSON.stringify(plants)}
                </Text> */}
                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                            data={item}
                            onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) =>
                        handleFetchMore(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadingMore
                            ? <ActivityIndicator color={colors.green} />
                            : <></>
                    }
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginVertical: 32,
        marginLeft: 32,
        paddingRight: 58,
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
})