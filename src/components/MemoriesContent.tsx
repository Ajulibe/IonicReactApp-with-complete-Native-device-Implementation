import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  isPlatform,
  IonRow,
  IonCol,
  IonGrid,
} from "@ionic/react";
import { add } from "ionicons/icons";

import MemoriesList from "./MemoriesList";
import { Memory } from "../data/memory-context";
import FixedBottomFab from "./FixedBottomFab";
import ToolbarAction from "./ToolbarAction";

const MemoriesContent: React.FC<{
  title: string;
  fallbackText: string;
  memories: Memory[];
}> = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{props.title}</IonTitle>
          {isPlatform("ios") && <ToolbarAction icon={add} link="/new-memory" />}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {props.memories.length === 0 && (
            <IonRow>
              <IonCol>
                <h2>{props.fallbackText}</h2>
              </IonCol>
            </IonRow>
          )}
          <MemoriesList items={props.memories} />
        </IonGrid>
        {!isPlatform("ios") && <FixedBottomFab icon={add} link="/new-memory" />}
      </IonContent>
    </IonPage>
  );
};

export default MemoriesContent;
