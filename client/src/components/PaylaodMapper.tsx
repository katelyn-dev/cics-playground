import { DisplayProgrammeData } from "./FormsCreator"
import { ProgrammeData } from "./ProgrammeCreator"


export const toClassesPayload = (data: ProgrammeData) => {
  const hasSubClass = data.isSubClass == true ? "T" : "F"
  const hasExtraAttributes = data.hasTimeSlot == true ? "T" : "F"

  let extraAttributesName = []
  if (data.hasTimeSlot == true) {
    data.timeSlots.map(timeslot => {
      extraAttributesName.push(`${timeslot.startTime} to ${timeslot.endTime}`)
    })
    extraAttributesName.push("All Time Slot", "Do not need")
  }

  const builder = {
    class_name_eng: data.engClassName,
    class_name_zhcn: data.zhcnClassName,
    class_name_zhhk: data.zhhkClassName,
    target_audience: data.targetAudience,
    class_fee : data.fee,
    class_start: data.startDate,
    class_end: data.endDate,
    extra_attributes_name: data.extraAttributesName,
    extra_attributes: { extra_attributes: extraAttributesName },
    has_extra_attributes: hasExtraAttributes,
    has_subclass: hasSubClass,
  }

  return JSON.stringify(builder)
}

export const templateToProgrammePayload = (json: string, data: DisplayProgrammeData) => {
  json = json.replace('${desc_zh_cn}', data.class_name_zhcn)
  json = json.replace('${desc_zh_cn}', data.class_name_zhcn)
  json = json.replace('${desc_zh_tw}', data.class_name_zhhk)
  json = json.replace('${title_default}', data.class_name_eng)
  json = json.replace('${title_zh_tw}', data.class_name_zhhk)
  json = json.replace('${title_zh_cn}', data.class_name_zhcn)
  return json
}

export const toSaveFormRequest = (newForm: string) => {
  return {
    "form_prefix": "CL",
    "form_json": newForm
  }
}

// {
//   "firstname": "Ken",
//   "lastname": "Ip",
//   "email": "test@gmail.com",
//   "contry_of_origin": "Canada",
//   "phone_number": "4162123121",
//   "address_city": "north_york",
//   "identity_status": "student_permit",
//   "years_in_canada": "less_than_1",
//   "is_first_time_apply": true,
//   "age_group": "25-29",
//   "gender": "male"
// }

// export const toMappedSurveyResponse = (formId: string, data:any) => { 
//   //1. base on target audience type by formId, check which table to insert
//   const firstname = data['firstname']

// }