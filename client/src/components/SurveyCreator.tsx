import {SurveyCreator} from "survey-creator-react";
import {useEffect, useRef, useState} from "react";
import 'survey-core/defaultV2.min.css';
import 'survey-creator-core/survey-creator-core.min.css';
import {Action, surveyLocalization} from "survey-core";
import {getCreatedFormJson} from "../api/dataService";
import {removeSurveyToolBoxItems, supportedLanguage, surveyOptions} from "../settings/surveyCreatorOptions";
import {useQuery} from "react-query";

const SurveyCreatorRenderComponent: React.FC = () => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const creatorRef = useRef<SurveyCreator | null>(null);
  const { data, error, isLoading } = useQuery<Object,Error>({queryKey: ['getCreatedFormJson'], queryFn: getCreatedFormJson});

  const saveActionButton = new Action({
    id: 'save',
    visible: true,
    title: 'Save',
    action: () => alert(JSON.stringify(creatorRef?.current?.JSON))
  })

  const sideBarButton = new Action({
    id: 'sidebar',
    visible: true,
    title: 'Sidebar',
    action: () => {
      if(creatorRef?.current) creatorRef.current.showSidebar = !creatorRef?.current?.showSidebar;
    }
  })

  useEffect(() => {

    if(!containerRef.current) return;

    if(isLoading || !data) return;

   const newCreator = new SurveyCreator(surveyOptions);
    newCreator.toolbarItems.splice(0, newCreator.toolbarItems.length);
    for (let i = 0; i < removeSurveyToolBoxItems.length; i++) newCreator.toolbox.removeItem(removeSurveyToolBoxItems[i]);

    newCreator.toolbarItems.push(saveActionButton)
    newCreator.toolbarItems.push(sideBarButton)
    newCreator.pageEditMode = "bypage";


    newCreator.onUploadFile.add(function (_, options) {
      const formData = new FormData();

      options.files.forEach(function (file) {
        formData.append(file.name, file);
      });
      fetch("https://api.surveyjs.io/private/Surveys/uploadTempFiles", {
        method: "post",
        body: formData
      })
        .then((response) => response.json())
        .then((result) => {
          options.callback(
            "success",
            // A link to the uploaded file
            "https://api.surveyjs.io/private/Surveys/getTempFile?name=" + result[options.files[0].name]
          );
        })
        .catch((error) => {
          options.callback('error');
        });
    });
    surveyLocalization.supportedLocales = supportedLanguage;
    creatorRef.current = newCreator;
    creatorRef.current.JSON = data
    creatorRef.current?.render("surveyCreatorContainer");

    return () => {
      if(creatorRef?.current) {
        creatorRef.current.dispose();
        creatorRef.current = null;
      }
    }
  }, [data, isLoading]);

  return (
    <div>
      <div ref={containerRef} id="surveyCreatorContainer" style={{marginTop: '80px', height: "800px"}}></div>
    </div>
  );
}

export default SurveyCreatorRenderComponent;
