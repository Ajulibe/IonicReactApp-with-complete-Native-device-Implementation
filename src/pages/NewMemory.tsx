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
} from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { useHistory } from "react-router-dom";

import MemoriesContext from "../data/memory-context";
import "./NewMemory.css";

const { Camera, Filesystem } = Plugins;

const NewMemory: React.FC = () => {
  const [takenPhoto, setTakenPhoto] = useState<{
    path: string;
    preview: string;
  }>();
  const [chosenMemoryType, setChosenMemoryType] = useState<"good" | "bad">();

  const memoriesCtx = useContext(MemoriesContext);

  const history = useHistory();

  //USING REF INSTEAD OF STATE TO SPICE THINGS UP :)
  const titleRef = useRef<HTMLIonInputElement>(null);

  const takePhotoHandler = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
      width: 500,
    });
    console.log(photo);

    if (!photo || !photo.path || !photo.webPath) {
      return;
    }

    //NOTE THAT IF STATEMENT HELPED TO REMOVE THE UNDEFINED ERROR TYPESCRIPT WAS
    //SHOWING US.REMOVE IT TO SEE
    setTakenPhoto({
      path: photo.path,
      preview: photo.webPath,
    });
  };

  const addMemoryHandler = async () => {
    //get the content of the input
    const enteredTitle = titleRef.current?.value;

    if (
      !enteredTitle ||
      enteredTitle.toString().trim().length === 0 ||
      !takenPhoto ||
      !chosenMemoryType
    ) {
      return;
    }

    const fileName = new Date().getTime() + ".jpeg";

    //Here wer converting the gotten photo preview to a base64 string and storing
    //the base64 string as the data
    const base64 = await base64FromPath(takenPhoto!.preview);

    Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: FilesystemDirectory.Data,
    });

    memoriesCtx.addMemory(fileName, enteredTitle.toString(), chosenMemoryType);

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
              <IonSelect onIonChange={selectMemoryTypeHandler} value="good">
                <IonSelectOption value="good">Good Memory</IonSelectOption>
                <IonSelectOption value="bad">Bad Memory</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center">
            <IonCol>
              <div className="image-preview">
                {!takenPhoto && <h3>Np Photo Chosen</h3>}
                {takenPhoto && <img src={takenPhoto.preview} alt="Preview" />}
              </div>
              <IonButton fill="clear" onClick={takePhotoHandler}>
                <IonIcon icon={camera} slot="start"></IonIcon>
                <IonLabel>Take Photo</IonLabel>
              </IonButton>
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
