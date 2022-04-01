module.exports = ({ res, geoip }) => ({

  /** Description.
     * @param  {object} event
     */
  getGeoLocation: async event => {
    try {

      const geo = geoip.lookup(event.ip);

      return res.status(200).json(geo);

    } catch (e) {
      console.error(e);
      return res.error('Internal Server Error', 500, 'Server Error', 500, JSON.stringify(e));
    }
  },
});
