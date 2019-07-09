import React from 'react'
import { connect } from 'react-redux'

import ApiUrlBuilder from "../functions/ApiUrlBuilder"
import { logCorrectAnswer, logIncorrectAnswer, updateInputAnswer } from "../actions/problems"

const Problem = (props) => {
  const { answerValue, dispatch, id, symbol, x_value, y_value } = props

  const correctAnswer = () => {
    const value = parseInt(answerValue)
    switch (symbol) {
    case "+":
      return x_value + y_value === value
    case "-":
      return x_value - y_value === value
    case "x":
      return x_value * y_value === value
    case "÷":
      return x_value / y_value === value
    default:
      return false
    }
  }

  const successUrl = ApiUrlBuilder(["problem", id, "log_success"])
  const failureUrl = ApiUrlBuilder(["problem", id, "log_failure"])

  const onSubmit = (e) => {
    if (correctAnswer()) {
      fetch(successUrl, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(() => dispatch(logCorrectAnswer({ id: id })))
    } else {
      fetch(failureUrl, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(() => dispatch(logIncorrectAnswer({ id: id })))
    }
  }

  const updateAnswer = (e) => {
    const action = updateInputAnswer(e.target.value)
    dispatch(action)
  }

  return (
    <div className="problem">
      <div className="x-value">
        {x_value}
      </div>
      <div className="symbol">
        {symbol}
      </div>
      <div className="y-value">
        {y_value}
      </div>
      <div className="equal-sign">
        =
      </div>
      <div className="answer">
        <input
          onChange={updateAnswer}
          value={answerValue}
        />
      </div>
      <div className="answer">
        <button
          type="submit"
          onClick={onSubmit}
        >
          ANSWER
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { index } = state.problems
  const selectedProblem = state.problems.collection[index]

  return {
    ...selectedProblem,
    answerValue: state.problems.answer,
  }
}

export default connect(mapStateToProps)(Problem)