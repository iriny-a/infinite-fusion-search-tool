export default () => {
  self.onmessage = (e: MessageEvent<{baseMon: string; searchMon: string;}>) => {
    console.log(e.data);
    postMessage("hello!!!!");
  }
}