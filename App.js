import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import React from 'react';
import colours from './Colours';
import ToDoList from './components/ToDoList';
import AddListModal from './components/AddListModal';
import Firebase from './Firebase';

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true
  };

  componentDidMount() {
    firebase = new Firebase((error, user) => {
      if (error) {
        return alert("Uh oh, something went wrong");
      }

      firebase.getLists(lists => {
        this.setState({lists, user}, () => {
          this.setState({loading: false});
        });
      });

      this.setState({user});
    });
  }

  componentWillUnmount() {
    firebase.detach();
  }

  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  renderList = list => {
    return <ToDoList list={list} updateList={this.updateList} deleteList={this.deleteList} />
  };

  addList = list => {
    firebase.addList({
      name: list.name,
      colour: list.colour,
      todos: []
    });
  }; 

  updateList = list => {
    firebase.updateList(list);
  };

  deleteList = list => {
    firebase.deleteList(list);
  };

  render(){
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colours.mayaBlue} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal 
          animationType="slide" 
          visible={this.state.addTodoVisible} 
          onRequestClose={()=>this.toggleAddTodoModal()}
        >
          <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
        </Modal>
       
        <View style={{flexDirection: "row"}}>
          <View style={styles.divider} />
          <Text style={{fontWeight: "300", fontSize: 38, color: colours.mayaBlue}}>
            My<Text style={styles.title}> To-Do</Text>
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={{marginVertical: 48}}>
          <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
            <AntDesign name="plus" size={16} color={colours.mayaBlue} />
          </TouchableOpacity> 

          <Text style={styles.add}>Add item</Text>
        </View>

        <View style={{height: 275, paddingLeft: 32}}>
          <FlatList 
            data={this.state.lists} 
            keyExtractor={item => item.id.toString()} 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
        <StatusBar style="auto" />
      </View>
    ); 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: colours.coralRed,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colours.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: colours.mayaBlue,
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    color: colours.mayaBlue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 12
  }
});
