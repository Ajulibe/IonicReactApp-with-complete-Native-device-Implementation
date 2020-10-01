import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import "./MemoryItem.css";

const MemoryItem: React.FC<{ image: string; title: string }> = (props) => {
  return (
    <>
      <IonCard className="memory-item">
        <IonCardHeader>
          <IonCardTitle>{props.title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="imageDiv">
          <img src={props.image} alt={props.title} className="image" />
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default MemoryItem;
