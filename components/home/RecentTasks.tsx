
import { View, Text, FlatList, TouchableOpacity, StyleSheet, } from 'react-native'

export default function RecentTasks() {

    const list = [
        { task: "test", id: 1},
        { task: "tesfsdfst", id: 2},
        { task: "tesfddssdfst", id: 3}
    ];
    return (
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>Recent Tasks</Text>
                        <FlatList
                            data={list}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.taskContainer}
                            renderItem={({ item }) => (
                                <TouchableOpacity >

                                    <Text>{item.task}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
    )
}

const styles = StyleSheet.create({
    taskContainer: {
        display: 'flex',
        justifyContent: 'center',


    }
})