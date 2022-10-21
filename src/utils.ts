const isObjectEqual = (obj1: any, obj2: any): boolean => {
  let o1 = obj1 instanceof Object;
  let o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    return obj1 === obj2
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (let attr in obj1) {
    let a1 = Object.prototype.toString.call(obj1[attr]) == '[object Object]'
    let a2 = Object.prototype.toString.call(obj2[attr]) == '[object Object]'
    let arr1 = Object.prototype.toString.call(obj1[attr]) == '[object Array]'
    if (a1 && a2) {
      return isObjectEqual(obj1[attr], obj2[attr])
    } else if (arr1) {
      if (obj1[attr].toString() != obj2[attr].toString()) {
        return false;
      }
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}

export {
  isObjectEqual
}
