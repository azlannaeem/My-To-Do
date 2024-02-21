import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated } from 'react-native';
import React from 'react';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import colours from '../Colours';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export default class TodoModal extends React.Component {
    state = {
        newTodo: ""
    };

    toggleTodoCompleted = index => {
        let list = this.props.list;
        list.todos[index].completed = !list.todos[index].completed;

        this.props.updateList(list);
    };

    addTodo = () => {
        let list = this.props.list;

        if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
            list.todos.push({title: this.state.newTodo, completed: false});

            this.props.updateList(list);
        }

        this.setState({newTodo: ""});
        Keyboard.dismiss();
    };

    deleteTodo = index => {
        let list = this.props.list;
        list.todos.splice(index, 1);

        this.props.updateList(list);
    };

    renderTodo = (todo, index) => {
        return(
            <GestureHandlerRootView>
                <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
                    <View style={styles.todoContainer}>
                        <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                            <Ionicons 
                                name={todo.completed ? "ios-checkmark-done-circle": "ios-ellipse-outline"} 
                                size={24} 
                                color={colours.black} 
                                style={{ width: 32 }} 
                            />
                        </TouchableOpacity>

                        <Text 
                            style={[
                                styles.todo, 
                                {
                                    textDecorationLine: todo.completed ? "line-through" : "none", 
                                    color: todo.completed ? colours.grey : colours.black
                                }
                            ]}
                        >
                            {todo.title}
                        </Text>
                    </View>
                </Swipeable>
            </GestureHandlerRootView>
        );
    };

    rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: "clamp"
        });

        return (
            <GestureHandlerRootView>
                <TouchableOpacity onPress={() => this.deleteTodo(index)}>
                    <Animated.View style={[styles.deleteButton, {opacity: opacity}]}>
                        <Animated.Text style={{color: colours.white, fontWeight: "800", transform: [{scale}]}}>Delete</Animated.Text>
                        {/* <Animated.Ionicons name={"trash-outline"}
                                size={24} 
                                color={colours.black} 
                                style={{ width: 32, transform: [{scale}]}}
                        />  */}
                    </Animated.View>
                </TouchableOpacity>
            </GestureHandlerRootView>
        );
    };

    render() {
        const list = this.props.list;

        const taskCount = list.todos.length;
        const completedCount = list.todos.filter(todo => todo.completed).length;
        
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity 
                        style={{position: "absolute", top: 64, left: 32, zIndex: 10}} 
                        onPress={this.props.closeModal}>
                        <AntDesign name="close" size={24} color={colours.black} />
                    </TouchableOpacity>

                    <View style={[styles.section, styles.header, {borderBottomColor: list.colour}]}>
                        <View>
                            <Text style={styles.title}>{list.name}</Text>
                            <Text style={styles.taskCount}>
                                {completedCount} of {taskCount} tasks
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.section, {flex: 3}]}>
                        <FlatList 
                            data={list.todos} 
                            renderItem={({item, index}) => this.renderTodo(item, index)} 
                            keyExtractor={item => item.title} 
                            contentContainerStyle={{paddingLeft: 32, paddingVertical: 64}} 
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    <View style={[styles.section, styles.footer]} >
                        <TextInput 
                            style={[styles.input, {borderColor: list.colour}]} 
                            onChangeText={text => this.setState({newTodo: text})} 
                            value={this.state.newTodo} 
                        />
                        <TouchableOpacity style={[styles.addTodo, {backgroundColor: list.colour}]} onPress={() => this.addTodo()}>
                            <AntDesign name="plus" size={16} color={colours.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    section: {
        flex: 1,
        alignSelf: "stretch",
    },
    header: {
        justifyContent: "flex-end",
        marginLeft: 32,
        borderBottomWidth: 3
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: colours.black
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colours.grey,
        fontWeight: "600"
    },
    footer: {
        paddingHorizontal: 32, 
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    todo: {
        color: colours.black,
        fontWeight: "700",
        fontSize: 16
    },
    deleteButton: {
        // flex: 1,
        padding: 5, 
        backgroundColor: colours.coralRed,
        justifyContent: "center",
        alignItems: "center",
        width: 80
    }
});