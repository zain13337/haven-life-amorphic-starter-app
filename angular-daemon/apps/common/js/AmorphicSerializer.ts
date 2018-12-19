export default class AmorphicSerializer {
  static stringify(objectMap) {
    const privates = ['_id', '_template', '__version__', '__id__', '__proto__'];
    return function(key: string, value) {
      if (key.startsWith('__') || key.startsWith('amorphic')) {
        if (privates.indexOf(key) === -1) {
          return undefined;
        }
      }
      if (value && value.__template__ && value.__id__) {
        if (objectMap[value.__id__]) {
          value = { __id__: value.__id__.toString() };
        }
        else {
          objectMap[value.__id__.toString()] = value;
        }
      }
      return value;
    };
  }

  static amorphicSerialize(amorphicObject) {
    const objectMap = [];
    try {
      return JSON.stringify(amorphicObject, AmorphicSerializer.stringify(objectMap));
    } catch (e) {
      throw e;
    }
  }
}
