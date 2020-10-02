import React, { useContext, useEffect } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router";
import { happy, sad } from "ionicons/icons";

import GoodMemories from "./pages/GoodMemories";
import BadMemories from "./pages/BadMemories";

import MemoriesContext from "./data/memory-context";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/theme.css";

//adding lazy loading
//This import statement will only be called when the newmemory component is really needed
// name the const with the same name as the componenet needed.
//Remember to add React.Suspense to wrap the Tabs.
//It helps to load a fallback component if another component
//maybe using laxy loading isnt laoding fast enough
const NewMemory = React.lazy(() => import("./pages/NewMemory"));

const App: React.FC = () => {
  const memoriesCtx = useContext(MemoriesContext);

  //whenever our app runs this is initiated and the memory state is set
  //with what has been stored in the database.
  const { initContext } = memoriesCtx;
  useEffect(() => {
    //anytime we are passinf a function to a useEffect make it a callback
    initContext();
  }, [initContext]);

  return (
    <IonApp>
      <IonReactRouter>
        <React.Suspense fallback={<IonSpinner />}>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/good-memories">
                <GoodMemories />
              </Route>
              <Route path="/bad-memories">
                <BadMemories />
              </Route>
              <Route path="/new-memory">
                <NewMemory />
              </Route>
              <Redirect to="/good-memories" />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              {/* the tab prop is menat to enable ioniv to know which tab is active.
          always include it */}
              <IonTabButton href="/good-memories" tab="good">
                <IonIcon icon={happy} />
                <IonLabel>Good Memories</IonLabel>
              </IonTabButton>
              <IonTabButton href="/bad-memories" tab="bad">
                <IonIcon icon={sad} />
                <IonLabel>Bad Memories</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </React.Suspense>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
