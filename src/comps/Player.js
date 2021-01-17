import React, { useState, useEffect, useContext } from "react";
import {ControlledEditor as MonacoEditor} from "@monaco-editor/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faSave } from "@fortawesome/fontawesome-free-solid";
import styled from "styled-components";

import saveFile from "../helper/saveFile";

import Mp3Player from "./Mp3Player";

export default function Player({ content, audio}) {
  const snapshots = content.snapshots;
  const lang = content.lang;
  const [theme, setTheme] = useState("vs-dark")
  const [text, setText] = useState(content.text);
  const [customizedText, setCustomizedText] = useState(text);
	const [currentPlayTime, setCurrentPlayTime] = useState(0);
	const [onPlay, setOnPlay] = useState(false);
	const [currentDuration, setDuration] = useState(0);

	const getCurrentSnapshot = (snapshots, timestamp) => {
		const currentSnapshot = snapshots.filter(
			(element) => parseInt(element.timestamp) === timestamp
		);
		return currentSnapshot[0].text;
  };
  
  const handleOnPlay = () => {
    setOnPlay(!onPlay);
  }
  
	const toggleTheme = () => {
    setTheme(theme === "vs-dark"? "light":"vs-dark");
  }

  const handleSaveChange = () => {
    saveFile(customizedText, lang);
  }
	const changeTimeInterval = () => {
		const durationInMS = Math.floor(currentDuration * 1000);
		console.log(durationInMS);
	};

  const handleEditorDidMount = (editor, monaco) => {
    console.log("editorDidMount", editor);
  };

  useEffect(() => {
		if (onPlay) {
			const interval = setInterval(() => {
        setCurrentPlayTime(currentPlayTime + 1);
        const currentText = getCurrentSnapshot(snapshots, currentPlayTime);
        setText(currentText);
        setCustomizedText(currentText);
      }, 800);
			return () => clearInterval(interval);
		}
	},[onPlay]);

  //set onPlay to true will erase user changes
  useEffect(() => {
		if (onPlay) { 
      setCustomizedText(text);
    }
	}, [onPlay]);

  const handleOnChange = (evt, newValue) => {
    debugger  
    setCustomizedText(newValue);
  }
	
	return (
		<Container >
      <Header >
        <ButtonGroup>
          <Button onClick={toggleTheme}>
          <FontAwesomeIcon icon={theme==="vs-dark"? faMoon:faSun} size="2x" />
          </Button>
          <Button onClick={handleSaveChange}> 
            <FontAwesomeIcon icon={faSave} size="2x" />
          </Button>
        </ButtonGroup>
       
        <Mp3Player onPlay={handleOnPlay}
            setDuration={setDuration} 
            audio={audio}/>
			</Header>
      <EditorContainer>
        <MonacoEditor
          height={100 + '%'}
          width={100 + '%'}
          language={lang}
          value={customizedText}
          onChange={handleOnChange}
          editorDidMount={handleEditorDidMount}
          theme={theme}
          //options={ {selectOnLineNumbers: true , minimap: { enable: false} }}
			  />
      </EditorContainer>
		</Container>
	);
}

const Container = styled.div`
  width:80%;
  height:100%;
  box-sizing: border-box;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 1rem;
  color: white;
  padding: 50px 80px;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction:row;
  gap:5px;
`
const Header = styled.div`
  width: 100%;
  height: 6%;
  display: flex;
  justify-content: space-between;
  align-items:center;
  margin:10px;
`;

const Button = styled.button`
  background-color: #fff;
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 3px;
  margin:5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditorContainer = styled.div`
  display:flex;
  width:100%;
  height:100%;
  margin-top:0;
  border:"1px solid #fff";
`