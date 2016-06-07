var cx = require('classnames');
var moment = require('moment');
var React = require('react');
var range = require('lodash/utility/range');
var chunk = require('lodash/array/chunk');

var Day = React.createClass({
  displayName: 'Day',

  render() {
    var i = this.props.i;
    var w = this.props.w;
    var prevMonth = (w === 0 && i > 7);
    var nextMonth = (w >= 4 && i <= 14);
    var m = moment(this.props.month);
    var selected = this.props.selected;
    if(prevMonth) m.subtract(1, 'month');
    if(nextMonth) m.add(1, 'month');
    m.date(i);
    var valid = this.props.isValid(m);

    var cn = cx({
      'prev-month': prevMonth,
      'next-month': nextMonth,
      'current-day': (m.isSame(selected, 'day')),
      'valid': valid,
      'invalid': !valid
    });

    return <td className={cn} onClick={this.props.selectDate.bind(null, m)} {... this.props}>{i}</td>;
  }
});

module.exports = React.createClass({
  displayName: 'Calendar',

  getInitialState() {
    // The inital month shown on the calendar is the month of the current moment
    return {month: moment(this.props.moment).startOf('month')};
  },

  render() {
    var m = this.props.moment;
    var month = this.state.month;
    var d = m.date();
    var d1 = month.clone().subtract(1, 'month').endOf('month').date();
    var d2 = month.clone().date(1).day();
    var d3 = month.clone().endOf('month').date();

    var days = [].concat(
      range(d1-d2+1, d1+1),
      range(1, d3+1),
      range(1, 42-d3-d2+1)
    );

    var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className={cx('m-calendar', this.props.className)}>
        <div className="toolbar">
          <button type="button" className="prev-month" onClick={this.prevMonth}>
            <i className={this.props.prevMonthIcon}/>
          </button>
          <span className="current-date">{month.format('MMMM YYYY')}</span>
          <button type="button" className="next-month" onClick={this.nextMonth}>
            <i className={this.props.nextMonthIcon}/>
          </button>
        </div>

        <table>
          <thead>
            <tr>
              {weeks.map((w, i) => <td key={i}>{w}</td>)}
            </tr>
          </thead>

          <tbody>
            {chunk(days, 7).map((row, w) => (
              <tr key={w}>
                {row.map((i) => (
                  <Day key={i} i={i} d={d} w={w}
                    month={month}
                    selected={m}
                    isValid={this.props.isValid}
                    selectDate={this.selectDate}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },

  selectDate(selectMoment) {
    var m = moment(this.props.moment);
    m.year(selectMoment.year()).month(selectMoment.month()).date(selectMoment.date());

    if(this.props.isValid(m)) {
      this.setState({month: moment(m).startOf('month')});
      this.props.onChange(m);
    }
  },

  prevMonth(e) {
    e.preventDefault();
    this.setState({month: this.state.month.subtract(1, 'month')});
  },

  nextMonth(e) {
    e.preventDefault();
    this.setState({month: this.state.month.add(1, 'month')});
  }
});
