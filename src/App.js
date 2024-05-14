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
    console.log(data)
    const  clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(data)

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
    this.setState({imageUrl:this.state.input});
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

    const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + "6e705fd9dd2d430ebbeff42022aefbb0"
    },
    body: raw
};
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs" ,requestOptions)
    .then((response)=>response.json())
    .then(result=>this.displayFaceBox(this.calculateFaceLocation(result)))
    .catch(console.log)
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