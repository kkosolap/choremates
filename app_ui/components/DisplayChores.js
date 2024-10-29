import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';

import { API_URL } from '@env';

// Victoria

const DisplayChoresList = () => {
    const [chores, setChores] = useState([]);
    const [checkedState, setCheckedState] = useState({}); // Object to track checked state for each chore

    // Fetch chores from the backend
    useEffect(() => {
        const fetchChores = async () => {
            try {
                const response = await fetch(API_URL + 'chores');
                const data = await response.json();
                setChores(data);

                const initialCheckedState = data.reduce((acc, chore) => {
                    acc[chore.id] = false; // set initial state for each chore as unchecked
                    return acc;
                }, {});
                setCheckedState(initialCheckedState);
            } catch (error) {
                Alert.alert('Error:' + error);
            }
        };

        fetchChores();
    }, []);

    const handleCheckboxChange = (id) => {
        setCheckedState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    // Allows for checkbox to be toggled
    // Checks state to decide if strikethrough
    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Chores To Do</Text>
            
            <FlatList
                data={chores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.container}>
                        <View style={styles.row}>
                            <Checkbox
                                style={styles.checkbox}
                                value={checkedState[item.id]}
                                onValueChange={() => handleCheckboxChange(item.id)}
                            />
                            <Text style={{
                                textDecorationLine: checkedState[item.id] ? 'line-through' : 'none',
                                fontSize: 16,
                                color: checkedState[item.id] ? 'grey' : 'black',
                            }}>
                                {item.chore_name}
                            </Text>
                        </View>
                        <StatusBar style="auto" />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        margin: 8,
        fontSize: 16,
        borderColor: '#000',
    },
});

export default DisplayChoresList;
