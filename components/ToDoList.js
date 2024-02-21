import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import colours from "../Colours";
import TodoModal from "./TodoModal";

export default class ToDoList extends React.Component {
    state = {
        showListVisible: false
    };

    toggleListModal() {
        this.setState({showListVisible: !this.state.showListVisible});
    }

    render() {
        const list = this.props.list

        const completedCount = list.todos.filter(todo => todo.completed).length;
        const remainingCount = list.todos.length - completedCount;

        return (
            <View>
                <Modal 
                    animationType="slide" 
                    visible={this.state.showListVisible} 
                    onRequestClose={() => this.toggleListModal()}>
                    <TodoModal 
                        list={list} 
                        closeModal={() => this.toggleListModal()} 
                        updateList={this.props.updateList} 
                    />
                </Modal>
                <TouchableOpacity 
                    style={[styles.listContainer, {backgroundColor: list.colour}]} 
                    onPress={() => this.toggleListModal()}
                    onLongPress={() => this.props.deleteList(list)}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                        {list.name}
                    </Text>
    
                    <View>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subtitle}>Remaining</Text>
                        </View>
                        <View style={{alignItems: "center"}}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subtitle}>Completed</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            
        );
    }
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 6, 
        marginHorizontal: 12, 
        alignItems: "center",
        width: 200
    },
    listTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colours.white,
        marginBottom: 18
    },
    count: {
        fontSize: 48,
        fontWeight: "200",
        color: colours.white
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colours.white
    }
})