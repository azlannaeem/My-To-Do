import { Text, StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import {AntDesign} from '@expo/vector-icons';
import colours from '../Colours';


export default class AddListModal extends React.Component {
    state = {
        name: "",
        colour: colours.otherBlue
    };

    createTodo = () => {
        const {name, colour} = this.state;

        const list = {name, colour};

        this.props.addList(list);

        this.setState({name: ""});
        this.props.closeModal();
    };

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TouchableOpacity style={{position: "absolute", top: 64, left: 32}} onPress={this.props.closeModal}>
                    <AntDesign name="close" size={24} color={colours.black} />
                </TouchableOpacity>

                <View style={{alignSelf: "stretch", marginHorizontal: 32}}>
                    <Text style={styles.title}>Create Task To-Do</Text>

                    <TextInput 
                        style={styles.input} 
                        placeholder="What To-Do?" 
                        onChangeText={text => this.setState({name: text})}/>

                    <TouchableOpacity 
                        style={[styles.create, {backgroundColor: colours.otherBlue}]} 
                        onPress={this.createTodo}>
                        <Text style={{color: colours.white, fontWeight: "600"}}>Create!</Text>
                    </TouchableOpacity>
                </View>
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
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colours.black,
        alignSelf: "center",
        marginBottom: 16
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colours.coralRed,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    }
});