import { ProgrammeData } from "./ProgrammeCreator"

let i = 1000
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
    class_group_id: 'CL' + i.toString(),
    class_name_eng: data.engClassName,
    class_name_zhcn: data.zhcnClassName,
    class_name_zhhk: data.zhhkClassName,
    target_audience: data.targetAudience,
    class_start: data.startDate,
    class_end: data.endDate,
    extra_attributes_name: data.extraAttributesName,
    extra_attributes: { extra_attributes: extraAttributesName },
    has_extra_attributes: hasExtraAttributes,
    has_subclass: hasSubClass,
  }

  i++;
  return JSON.stringify(builder)
}