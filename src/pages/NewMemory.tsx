import React, { useState, useRef, useContext } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  FilesystemDirectory,
  Capacitor,
} from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { useHistory } from "react-router-dom";

import MemoriesContext from "../data/memory-context";
import "./NewMemory.css";

const { Camera, Filesystem } = Plugins;

const NewMemory: React.FC = () => {
  const [takenPhoto, setTakenPhoto] = useState<{
    path: string | undefined;
    preview: string;
  }>();
  const [chosenMemoryType, setChosenMemoryType] = useState<"good" | "bad">();

  const memoriesCtx = useContext(MemoriesContext);

  const history = useHistory();

  //USING REF INSTEAD OF STATE TO SPICE THINGS UP :)
  const titleRef = useRef<HTMLIonInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    filePickerRef.current!.click();
  };

  const pickFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target!.files![0];
    console.log(file);
    //this is an inbuilt JS Api
    const fr = new FileReader();
    fr.onload = () => {
      setTakenPhoto({
        path: undefined,
        preview: fr.result!.toString(),
      });
    };

    fr.readAsDataURL(file);
  };

  const takePhotoHandler = async () => {
    //incase there is no file picker
    console.log(Capacitor.isPluginAvailable("Camera"));
    if (!Capacitor.isPluginAvailable("Camera")) {
      openFilePicker();
      return;
    }
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90,
        width: 500,
      });
      // console.log(photo);

      if (!photo || !photo.webPath) {
        return;
      }

      //NOTE THAT IF STATEMENT HELPED TO REMOVE THE UNDEFINED ERROR TYPESCRIPT WAS
      //SHOWING US.REMOVE IT TO SEE
      setTakenPhoto({
        path: photo.path ? photo.path : "path",
        preview: photo.webPath,
      });
    } catch (error) {
      openFilePicker();
    }
  };

  const addMemoryHandler = async () => {
    console.log("started");
    //get the content of the input
    const enteredTitle = titleRef.current?.value;
    console.log(takenPhoto);
    console.log(chosenMemoryType);

    if (
      !enteredTitle ||
      enteredTitle.toString().trim().length === 0 ||
      !takenPhoto ||
      !chosenMemoryType
    ) {
      alert("Select all options");
      return;
    }

    const fileName = new Date().getTime() + ".jpeg";

    console.log(fileName);

    //Here wer converting the gotten photo preview to a base64 string and storing
    //the base64 string as the data
    const base64 = await base64FromPath(takenPhoto!.preview);

    Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: FilesystemDirectory.Data,
    });
    console.log(memoriesCtx.addMemory);
    memoriesCtx.addMemory(
      fileName,
      base64,
      enteredTitle.toString(),
      chosenMemoryType
    );

    history.length > 0 ? history.goBack() : history.replace("/good-memories");
  };

  const selectMemoryTypeHandler = (event: CustomEvent) => {
    const selectedMemoryType = event.detail.value;
    setChosenMemoryType(selectedMemoryType);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/good-memories" />
          </IonButtons>
          <IonTitle>Add New Memory</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>New Memory</h2>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Memory Title</IonLabel>
                <IonInput type="text" ref={titleRef}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect
                onIonChange={selectMemoryTypeHandler}
                value={chosenMemoryType}
                placeholder="Select One"
              >
                <IonSelectOption value="good">Good Memory</IonSelectOption>
                <IonSelectOption value="bad">Bad Memory</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center">
            <IonCol>
              <div className="image-preview">
                {!takenPhoto && <h3>No Photo Chosen</h3>}
                {takenPhoto && <img src={takenPhoto.preview} alt="Preview" />}
              </div>
              <IonButton fill="clear" onClick={takePhotoHandler}>
                <IonIcon icon={camera} slot="start"></IonIcon>
                <IonLabel>Take Photo</IonLabel>
              </IonButton>
              <input
                type="file"
                hidden
                ref={filePickerRef}
                onChange={pickFileHandler}
              />
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top">
            <IonCol className="ion-text-center">
              <IonButton onClick={addMemoryHandler}>Add Memory</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default NewMemory;
