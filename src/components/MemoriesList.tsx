import React from "react";
import { IonCol, IonRow } from "@ionic/react";
import MemoryItem from "./MemoryItem";
import { Memory } from "../data/memory-context";

const MemoriesList: React.FC<{ items: Memory[] }> = (props) => {
  return (
    <>
      {" "}
      {props.items.map((memory) => (
        <IonRow key={memory.id}>
          <IonCol>
            <MemoryItem image={memory.base64Url} title={memory.title} />
          </IonCol>
        </IonRow>
      ))}
    </>
  );
};

export default MemoriesList;
