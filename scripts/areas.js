


Object.keys(data.entities).filter((k) => k.match(/\d\-(.*)/)).forEach((k) => {

  console.log(k, '=> ', data.entities[k])
});