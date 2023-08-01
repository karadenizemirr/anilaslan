import * as handlebars from 'handlebars';
import moment from 'moment';


handlebars.registerHelper('eq', function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

handlebars.registerHelper('earningApporoved', function(values:any){

    let earning = 0

    values.forEach((val:any) => {
      if (val){
        let price = parseFloat(val.work.price)
        val.work.price = price.toFixed(2)
        earning += price
      }
    })

    return earning

  })

handlebars.registerHelper('dateFormat', function(date:any){
    const d = new Date(date)
    
    return d.toLocaleDateString('tr-TR')
  })

  export default handlebars