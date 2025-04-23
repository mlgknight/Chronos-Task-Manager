import React, { useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { CategoryProps } from '../../types';



const Category: React.FC<CategoryProps> = ({ categories }) => {



    if (categories?.length === 0) {
        return (
            <View>
                <Text style={styles.noCategoriesText}>No categories available</Text>
            </View>
        );
    }

	useEffect(() => {

	}, [categories]);

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Category</Text>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.categoryListContainer}
                renderItem={({ item }) => (
                    <View style={[styles.boxCategory, { backgroundColor: item.color }]}>
                        <Text style={styles.boxText}>{item.name}</Text>
                        <Text style={styles.taskCountText}>5 Tasks</Text>
                        <TouchableOpacity>
                            <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/Add-Button.png')} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    boxText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryListContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    boxCategory: {
        width: 150,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 15,
        padding: 15,
    },
    taskCountText: {
        color: '#fff',
        fontSize: 14,
        marginVertical: 5,
    },
    plusText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    noCategoriesText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Category;
