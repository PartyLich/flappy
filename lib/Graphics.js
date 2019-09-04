define(function (require) {

  /** Graphics Engine
   */
  class Graphics {
  constructor(mediator) {
    var sub = mediator.subscribe;

    sub('g:drawObject', this.drawObj);
    sub('g:clearObject', this.clearObj);
    sub('g:drawBg', this.drawBg);
    sub('g:maskImg', this.maskImg);
  }

  /**
   */
  drawObj(/*obj, ctx*/ args) {
    var obj = args[0],
        ctx = args[1];

//    console.log('Graphic engine drawObj', obj);
    obj.draw(ctx);
  }


  /**
   */
  clearObj(/*obj, ctx*/ args) {
    var obj = args[0],
        ctx = args[1];

//    console.log('Graphic engine clearObj', obj);
    obj.clear(ctx);
  }


  //Responds to $(bg).one('load', mediator.publish('g:drawBg', this, ctxBg);
  drawBg(/*bg, ctx, cX, cY*/args) {
    console.log('Graphic engine drawBg');
    var width, height,
        x, y,
        bg = args[0],
        ctx = args[1],
        cX = args[2],
        cY = args[3];

    console.log('BG loaded2');
    ctx.fillStyle = '#0000EE';
    ctx.fillRect(0, 0, cX, cY);

    //Draw background image on the background canvas.
    ctx.save();

    width = cX;
    height = cY;
    x = 0;
    y = 0;
//    width = bg.width/2;
//    height = bg.height/2;
//    x = (cX - width) / 2;
//    y = (cY - height) / 2;

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
    var obj = args[0],
        alpha = args[1],
        img = args[2],

        buffer,
        ctxBuf,
        imgData,
        data,
        i;


    //Create a buffer for off screen drawing.
    buffer = document.createElement('canvas');

    buffer.width = img.width;
    buffer.height = img.height;
    ctxBuf = buffer.getContext('2d');

    //Draw alpha mask image to buffer.
    ctxBuf.drawImage(alpha, 0, 0);

    //Get imagedata
    imgData = ctxBuf.getImageData(0, 0, img.width, img.height);
    data = imgData.data;

    //Set alpha channel values for inverse alpha mask.
    for(var i = data.length - 1; i > 0; i -= 4) {
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
