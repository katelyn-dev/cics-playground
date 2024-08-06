import {SurveyCreator} from "survey-creator-react";
import React, {useEffect, useRef} from "react";
import 'survey-core/defaultV2.min.css';
import 'survey-creator-core/survey-creator-core.min.css';
import {Action, surveyLocalization} from "survey-core";
import {getCreatedFormJson, translateText} from "../api/dataService";
import {removeSurveyToolBoxItems, supportedLanguage, surveyOptions} from "../settings/surveyCreatorOptions";
import {useQuery} from "react-query";

const SurveyCreatorRenderComponent: React.FC = () => {

  const containerRef = useRef<HTMLDivElement | null>(null);
  const creatorRef = useRef<SurveyCreator | null>(null);
  const { data, error, isLoading } = useQuery<Object,Error>({queryKey: ['getCreatedFormJson'], queryFn: getCreatedFormJson});


  const translateSurveyJSON = async(json: any, targetLocale: string): Promise<JSON> => {
    if(!json) return {} as JSON;

    const translatedJSON = { ...json };

    translatedJSON.title[targetLocale] = await translateText(json.title?.default ?? json.title, targetLocale);
    translatedJSON.description[targetLocale] = await translateText(json.description?.default ?? json.description, targetLocale);

    console.log(`${targetLocale}: ${translatedJSON.title[targetLocale]}`)
    console.log(`${targetLocale}: ${translatedJSON.description[targetLocale]}`)

    translatedJSON.pages = await Promise.all(json.pages.map(async(page: any) => ({
      ...page,
      elements: await Promise.all(page.elements.map(async(element: any) => ({
        ...element,
        title: {
          ...element.title,
          [targetLocale]: await translateText(element.title?.default ?? element.title, targetLocale),
        },
        description: {
          ...element?.description,
          [targetLocale]: await translateText(element?.description?.default ?? element?.description, targetLocale),
        },
        minRateDescription: element.minRateDescription
          ? {
            ...element.minRateDescription,
            [targetLocale]: await translateText(
              element.minRateDescription.default ?? element.minRateDescription,
              targetLocale
            ),
          }
          : undefined,
        maxRateDescription: element.maxRateDescription
          ? {
            ...element.maxRateDescription,
            [targetLocale]: await translateText(
              element.maxRateDescription.default ?? element.maxRateDescription,
              targetLocale
            ),
          }
          : undefined,
      }))),
    })));

    return translatedJSON;
  }

  const saveActionButton = new Action({
    id: 'save',
    visible: true,
    title: 'Save',
    action: async() => {
      if(!creatorRef?.current) return;
      const currentJson = creatorRef?.current?.JSON
      const chineseResult = await translateSurveyJSON(currentJson, 'zh-cn')
      const result = await translateSurveyJSON(chineseResult, 'zh-tw')
      creatorRef.current.JSON = result;
      alert(JSON.stringify(result))
    }
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

    creatorRef.current?.onElementAllowOperations.add(function (sender, options) {

        //options.allowEdit = false;
    })
    creatorRef.current?.onSurveyInstanceCreated.add(function (sender, options) {
      const spans = document.querySelectorAll('span');
      if(creatorRef.current?.JSON.elements?.allowEdit === false) {
        
      }
      // Loop through each span element
      spans.forEach((span) => {
        // Check if the text content is "ui"
        if (span?.textContent === "Username") {
          // Disable contentEditable
          span.contentEditable = "false";
        }
    })})

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
