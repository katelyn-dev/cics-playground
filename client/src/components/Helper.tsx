import background1 from '../static/image/background/random-background-1.jpg'
import background2 from '../static/image/background/random-background-2.jpg'
import background3 from '../static/image/background/random-background-3.jpg'
import background4 from '../static/image/background/random-background-4.jpg'
import background5 from '../static/image/background/random-background-5.jpg'

export class Helper {
  static postRequestHeader = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  static getRandomBackground = () => { 
    const images = [background1, background2, background3,
      background4, background5]
    const getRandomVariable = (arr: string[]) => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
    return getRandomVariable(images)
  }

}
