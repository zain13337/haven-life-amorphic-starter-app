import * as moment from 'moment';
import { ModelCtx } from './ModelCtx';

export default class AmorphicDeserializer {
  public static deserialize(jsonObject: any, objectMap: { [K in string]: any }): any {
    if (!objectMap) {
      objectMap = {};
    }
    if (!jsonObject.__id__) {
      return;
    }
    const modelClass = ModelCtx.getClass(jsonObject._template) || Object;
    if (!modelClass) {
      console.log('Error, missing class. Will default to generic object');
    }
    const obj = new modelClass();
    objectMap[jsonObject.__id__.toString()] = obj;

    for (const jsonProp in jsonObject) {
      if (jsonObject.hasOwnProperty(jsonProp)) {
        const property = jsonObject[jsonProp];
        if (property == null) {
          obj[jsonProp] = null;
        }
        else if (property !== undefined && property !== null) {
          if (property instanceof Array && property[0] instanceof Object && property[0].__id__) {
            obj[jsonProp] = [];
            property.forEach(prop => obj[jsonProp].push(AmorphicDeserializer.getChildObject(prop, objectMap, )));
          }
          else if (property instanceof Object && property.__id__) {
            obj[jsonProp] = AmorphicDeserializer.getChildObject(property, objectMap);
          }
          else if (moment(property, moment.ISO_8601, true).isValid()) {
            obj[jsonProp] = new Date(property);
          }
          else {
            obj[jsonProp] = property;
          }
        }
      }
    }

    if (jsonObject._id) {
      obj._id = jsonObject._id;
    }

    return obj;
  }

  public static getChildObject(property: { __id__: any }, objectMap: { [K in string]: any }): any {
    if (property.__id__ && objectMap[property.__id__.toString()]) {
      return objectMap[property.__id__.toString()];
    }
    else {
      return AmorphicDeserializer.deserialize(property, objectMap);
    }
  }
}
