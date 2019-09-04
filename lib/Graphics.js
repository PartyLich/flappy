define(function (require) {

  /** Graphics Engine
   */
  class Graphics {
  constructor(mediator) {
    const sub = mediator.subscribe;

    sub('g:drawObject', this.drawObj);
    sub('g:clearObject', this.clearObj);
    sub('g:drawBg', this.drawBg);
    sub('g:maskImg', this.maskImg);
  }

  /**
   */
  drawObj(/*obj, ctx*/ args) {
    const obj = args[0];
    const ctx = args[1];

//    console.log('Graphic engine drawObj', obj);
    obj.draw(ctx);
  }


  /**
   */
  clearObj(/*obj, ctx*/ args) {
    const obj = args[0];
    const ctx = args[1];

//    console.log('Graphic engine clearObj', obj);
    obj.clear(ctx);
  }


  //Responds to $(bg).one('load', mediator.publish('g:drawBg', this, ctxBg);
  drawBg(/*bg, ctx, cX, cY*/args) {
    console.log('Graphic engine drawBg');
    const bg = args[0];
    const ctx = args[1];
    const cX = args[2];
    const cY = args[3];

    console.log('BG loaded2');
    ctx.fillStyle = '#0000EE';
    ctx.fillRect(0, 0, cX, cY);

    //Draw background image on the background canvas.
    ctx.save();

    const width = cX;
    const height = cY;
    const x = 0;
    const y = 0;

    console.log(bg, x, y, width, height);
    ctx.drawImage(bg, x, y, width, height);
    ctx.restore();
    ctx.font = 'normal 9px sans-serif';
  }

  /** Applies the (inverse) alpha mask and saves the composite [ImageElement] to img.
   * @param {Image} alpha
   * @param {Image} img
   */
  maskImg(/*obj, alpha, img*/ args) {
//console.log('Graphics mask image');
    const obj = args[0];
    const alpha = args[1];
    const img = args[2];


    //Create a buffer for off screen drawing.
    const buffer = document.createElement('canvas');

    buffer.width = img.width;
    buffer.height = img.height;
    const ctxBuf = buffer.getContext('2d');

    //Draw alpha mask image to buffer.
    ctxBuf.drawImage(alpha, 0, 0);

    //Get imagedata
    const imgData = ctxBuf.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;

    //Set alpha channel values for inverse alpha mask.
    for(let i = data.length - 1; i > 0; i -= 4) {
      data[i] = 255 - data[i - 3];
    }

//    ctxBuf.clearRect(0, 0, this.width, this.height);
    ctxBuf.clearRect(0, 0, img.width, img.height);
    ctxBuf.putImageData(imgData, 0, 0);

    //Combine image + mask on buffer.
    ctxBuf.globalCompositeOperation = 'xor';
    ctxBuf.drawImage(img, 0, 0);

    //Save final image.
    obj.img.src = buffer.toDataURL('image/png');
  }
  }


  return Graphics;
});
