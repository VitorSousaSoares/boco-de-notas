import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView,TouchableOpacity, TextInput } from 'react-native';
import React,{useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';


export default function App() {
  
  const [pagina, setPagina] = useState ('principal')
  const [tarefas, setarTarefas] = useState([]);


  const [editeTxt,setEditarTxt ] = useState ('')
  const [editeTitulo,setEditarTitulo ] = useState ('')
 
  
  const [TarefaAtual, setTarefaAtual] = useState('');
  const [TituloAtual, setTituloAtual] = useState('');
  
  useEffect(()=>{
    (async()=>{
      try{
        let TarefaAtual = await AsyncStorage.getItem('tarefas');
        if(TarefaAtual == null)
          setarTarefas([]);
        else
          setarTarefas(JSON.parse(TarefaAtual));
      }catch(erro){

      }
    })();
  },[])

  function alerta(titulo,tarefa){
    setEditarTitulo(titulo)
    setEditarTxt(tarefa)
    setPagina('ver')
    
  }


  function addTarefa(){
    
    // setModal(!modal);

    let id = 0;
    if(tarefas.length > 0){
      id = tarefas[tarefas.length-1].id+1;
    }

    let titulo = {id:id, titulo:TituloAtual, tarefa:TarefaAtual};
    setarTarefas([...tarefas,titulo]);

    (async()=>{
      try{
        await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas,titulo]))
      } catch (error){

      }
    })();

    setPagina('principal');
  }

  
  

  function excluir (id){

    let newTarefas = tarefas.filter(function(val){
      return val.id != id;
    });

    setarTarefas(newTarefas);

    (async()=>{
      try{
        await AsyncStorage.setItem('tarefas',JSON.stringify(newTarefas));
      }catch(error){

      }
    })();
    
    setPagina('principal');
    
  }




  if (pagina == 'principal') {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Minhas tarefas</Text>
        <ScrollView >
        {
          tarefas.map(function(val){
            return(
              <View style={styles.tarefas}>
                
                <Text style={styles.taferaTxt}>{val.titulo}</Text>
                
                <TouchableOpacity onPress={()=> alerta(val.titulo, val.tarefa)} style={styles.ver} >
                  <AntDesign name="filetext1" size={24} color="black" />
                </TouchableOpacity>
              
                <TouchableOpacity onPress={()=> excluir(val.id)}>
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
                
              </View>);
            })
          }
        </ScrollView>
        <TouchableOpacity style={styles.btn} onPress={()=> setPagina("cadastra")}>
          <Text style={{alignSelf: 'center'}}>
            CADASTRO
          </Text>  
        </TouchableOpacity>
        <StatusBar style='#6495ed' hidden />
      </View>
    );
  }else if (pagina == 'ver') {
    return (
      <View style={styles.containerver}>
        <Text
          style={{
            fontSize: 20,
            paddingTop: 8,
            paddingLeft:8,
            paddingBottom: 8,
            backgroundColor:'#fff'
          }}
        >
          {editeTitulo}
        </Text>
        <ScrollView>

          <TextInput
            autoFocus={false}
            multiline={true}
            numberOfLines={5}
            onChangeText={text => setTarefaAtual(text)}
          >
            {editeTxt}
          </TextInput>
        </ScrollView>
        <View>
        <TouchableOpacity onPress={()=> setPagina('principal')} style={styles.btn}>
          <Text style={{alignSelf: 'center'}}>
            VOLTAR
          </Text>  
        </TouchableOpacity>
        </View>
        <StatusBar style='#6495ed' hidden />
      </View>
    );
  }else if (pagina == 'cadastra') {
    return(
      <View style={styles.container}>
        <View style={styles.contenerbtn}>
        <TouchableOpacity onPress={()=>addTarefa()} style={styles.btncadastro}>
          <Text style={{alignSelf: 'center'}}>
            CADASTRAR
        </Text>
        </TouchableOpacity> 
        <TouchableOpacity onPress={()=> setPagina('principal')} style={styles.btncadastro}>
          <Text style={{alignSelf: 'center'}}>
            VOLTAR
          </Text>  
        </TouchableOpacity>
        </View>

        <View style={styles.titulocadastro}>
        <Text
          style={{
            paddingTop:7,
            paddingBottom:7,
            paddingLeft:5,
            paddingRight:3,
            fontSize:18,
            backgroundColor:'#dcdcdc'
          }}
        >
          TITULO:</Text>
        <TextInput
          autoFocus = {false}
          multiline = {true}
          numberOfLines={1}
          onChangeText={text => setTituloAtual(text)}
          style={{
            paddingLeft:8,
          }}
        >

        </TextInput>
        </View>
        <ScrollView
          style={styles.containerver}
        >
        <TextInput
          autoFocus = {true}
          multiline = {true}
          onChangeText={text => setTarefaAtual(text)}
          style={{paddingLeft:5}}
        >
        </TextInput>
        </ScrollView>
        
      </View>
    );
    
  }

 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom:5,
    
  },
  containerver: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom:5,
    backgroundColor:'#f8f8ff'
  },

  header:{
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom:15,
    fontSize: 18,
  },

  tarefas: {
    marginBottom: 5,
    width: '100%',
    paddingTop: 8,
    paddingBottom:8,
    paddingLeft: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent:'space-around',
    backgroundColor:'#f8f8ff'
    
  },

  taferaTxt:{
    width:'80%'
  },

  logos:{
    width: '15%'
  },

  contenerbtn:{
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  btn:{
    alignSelf: 'center',
    backgroundColor: "#a9a9a9",
    width:"50%",
    height: 30,
    fontSize:15, 
    paddingTop:3
  },

  btncadastro:{
    backgroundColor: "#a9a9a9",
    width:"50%",
    height: 30,
    fontSize:15, 
    paddingTop:3
  },

  titulocadastro:{
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});
