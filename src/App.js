import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai'
import axios from 'axios'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css';


const app = new Clarifai.App({
  apiKey: '60dc58692e9f4dd9867759d2ca8693b1'
});

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

  calculateFaceLocation =(data)=>{
    const  clarifaiFace = JSON.parse(data, null, 2).outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace)
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }
  displayFaceBox=(box)=>{
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event)=>{
    this.setState({input: event.target.value})
  }

  onButtonSubmit = ()=>{
    const raw = JSON.stringify({
      user_app_id : {
        user_id: "fa",
        app_id: "noblesse"
      },
      inputs:[
      {
        data:{
          image:{
            url:this.state.input
          },
        },
      },              
      ],
    });
    fetch(
      "https://api.clarifai.com/v2/models/60dc58692e9f4dd9867759d2ca8693b1/outputs",{
        method: "POST",
        headers:{
          Accept:"application/json",
          Authorisation:"6e705fd9dd2d430ebbeff42022aefbb0",
        },
        body:raw,
      }
      )
    .then((response)=>response.text())
    .then(result=>this.displayFaceBox(this.calculateFaceLocation(result)))
    .catch(err=>console.log("oops", err));

  }

  render(){
  return (
    <div className="App">
     <ParticlesBg type="circle" bg={true} />
      <Navigation />
      <Logo />
      <Rank/>
      <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
      <FaceRecognition  box ={this.state.box} imageUrl ={this.state.imageUrl}/>
      
    </div>
  );
}
}

export default App;
