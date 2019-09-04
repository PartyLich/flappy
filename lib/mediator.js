define(function (require) {
  /** Mediator pattern implementation.
   * based on previous work by @rpflorence
   */
  const Mediator = function () {
    const mediator = this;
    mediator.channels = {};

    /** Subscribe to a specified channel and register a callback function.
     * @param {String} channel  The channel to subscribe to.
     * @param {Function} fn  The callback function for events published to this channel.
     * @returns
     */
    function subscribe(channel, fn) {
      if (!mediator.channels[channel]) { mediator.channels[channel] = []; }
      mediator.channels[channel].push({context: this, callback: fn});

      return this;
    }

    /** Publish an event to the specified channel.
     * @param {String} channel  The name of the channel to publish to
     * @returns
     */
    function publish(channel, ...args) {
      if (!mediator.channels[channel]) { return false; }
      let subscription;

      for (let i = 0; subscription = mediator.channels[channel][i]; i++) {
        subscription.callback.apply(subscription.context, new Array(args));
      }

      return this;
    }

    /** Remove a callback from the specified channel
     * @param {String} channel  The channel to unsubscribe from.
     * @param {Function} fn  (optional?) The callback function to remove from this channel.
     * @return
     */
    function unsub(channel, fn) {
      if (!mediator.channels[channel] || fn == null) { return false; }
      var i, subscription;

      for (i = 0; subscription = mediator.channels[channel][i]; i++) {
        if (subscription.callback == fn) {
          console.log('found the unsub target! '+i+'');
          mediator.channels[channel].splice(i, 1);
        }
      }

      return this;
    }

    /**
     * Mixin mediator functions to supplied obj
     * @param  {object} obj object to extend
     */
    function installTo(obj) {
      obj.subscribe = subscribe;
      obj.publish = publish;
    }

    return {
      channels: this.channels,
      publish,
      subscribe,
      unsub,
      installTo,
    };
  };

  return Mediator;
});
