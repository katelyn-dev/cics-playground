import {SurveyCreator} from "survey-creator-react";
import React, {useEffect, useRef, useState} from "react";
import 'survey-core/defaultV2.min.css';
import 'survey-creator-core/survey-creator-core.min.css';
import {Action, IElement, surveyLocalization} from "survey-core";
import {getCreatedFormJson, translateText} from "../api/dataService";
import {removeSurveyToolBoxItems, supportedLanguage, surveyOptions} from "../settings/surveyCreatorOptions";
import {useQuery} from "react-query";
import axios from "axios";
import { Helper } from "./Helper";

interface SurveyFormProps {
  id: string;
}

const SurveyCreatorRenderComponent: React.FC<SurveyFormProps> = ({ id }) => {
  console.log(`number: ${id}`)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const creatorRef = useRef<SurveyCreator | null>(null);
  const { data, error, isLoading } = useQuery<string, Error>(
    ["getCreatedFormJson", id], // Include id in the query key
    () => getCreatedFormJson(id) // Pass id via the closure
  );

  // Function to download JSON as a file
  const downloadJsonFile = (json: any, filename: string) => {
    const jsonString = JSON.stringify(json, null, 2); // Pretty-print JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const translateSurveyJSON = async(json: any, targetLocale: string): Promise<JSON> => {
    if(!json) return {} as JSON;

    const translatedJSON = { ...json };
    if(typeof translatedJSON.title === 'string') translatedJSON.title = { default: translatedJSON.title }
    if(typeof translatedJSON.description === 'string') translatedJSON.description = { default: translatedJSON.description }

    translatedJSON.title[targetLocale] = await translateText(json.title?.default ?? json.title, targetLocale);
    translatedJSON.description[targetLocale] = await translateText(json.description?.default ?? json.description, targetLocale);


    translatedJSON.pages = await Promise.all(json.pages.map(async(page: any) => ({
      ...page,
      elements: await Promise.all(page.elements.map(async(element: any) => {
        // Determine the title structure
        const title =
          element.title && element.title.default !== undefined
            ? {
              ...element.title,
              [targetLocale]: await translateText(element.title.default, targetLocale),
            }
            : {
              default: element.title,
              [targetLocale]: await translateText(element.title, targetLocale),
            };

        // Handle other optional fields similarly
        const description =
          element.description && element.description.default !== undefined
            ? {
              ...element.description,
              [targetLocale]: await translateText(element.description.default, targetLocale),
            }
            : element.description
              ? {
                default: element.description,
                [targetLocale]: await translateText(element.description, targetLocale),
              }
              : undefined;

        const minRateDescription =
          element.minRateDescription && element.minRateDescription.default !== undefined
            ? {
              ...element.minRateDescription,
              [targetLocale]: await translateText(
                element.minRateDescription.default,
                targetLocale
              ),
            }
            : element.minRateDescription
              ? {
                default: element.minRateDescription,
                [targetLocale]: await translateText(element.minRateDescription, targetLocale),
              }
              : undefined;

        const maxRateDescription =
          element.maxRateDescription && element.maxRateDescription.default !== undefined
            ? {
              ...element.maxRateDescription,
              [targetLocale]: await translateText(
                element.maxRateDescription.default,
                targetLocale
              ),
            }
            : element.maxRateDescription
              ? {
                default: element.maxRateDescription,
                [targetLocale]: await translateText(element.maxRateDescription, targetLocale),
              }
              : undefined;

        return {
          ...element,
          title,
          description,
          minRateDescription,
          maxRateDescription,
        };
      })
      ),
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
      // Download the translated JSON as a file
      downloadJsonFile(result, "translated-survey.json");
      //update db json //updateForm post 
      const form_id = id
      const form_json = JSON.stringify(result)
      const request = JSON.stringify({
        form_id: form_id,
        form_json: form_json
      })
      const updateFormUrl = `${process.env.REACT_APP_BASE_URL}updateForm?`
      const response = await axios.post<any[]>(updateFormUrl, request, Helper.postRequestHeader);
      const data = response.data
      console.log(data)
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
    creatorRef.current.JSON = data;
    creatorRef.current?.render("surveyCreatorContainer");

    creatorRef.current?.onElementAllowOperations.add(function (sender, options) {

        //options.allowEdit = false;
    })
    creatorRef.current?.onSurveyInstanceCreated.add(function (sender, options) {
      console.log("Survey instance created")
      const spans = document.querySelectorAll('span');
      console.log(data)
      let submitData;
      if (typeof data === 'string') {
        submitData = JSON.parse(data)
      } else {
        submitData = data
      }
      submitData?.pages.forEach((page: any) => {
        page.elements.forEach((element: any) => {
          console.log("called")
          if (element?.isLocked) {
            console.log(element)
            // Loop through each span element
            spans.forEach((span) => {
              // Check if the text content is "ui"
              if (span?.textContent === element.title.default) {
                // Disable contentEditable
                span.contentEditable = "false";
              }
            })
          }

        })
      })
      creatorRef.current?.onSurveyInstanceCreated.clear()
    })
  }, [data, isLoading]);

  return (
    <div>
      <div ref={containerRef} id="surveyCreatorContainer" style={{marginTop: '80px', height: "800px"}}></div>
    </div>
  );
}

export default SurveyCreatorRenderComponent;
