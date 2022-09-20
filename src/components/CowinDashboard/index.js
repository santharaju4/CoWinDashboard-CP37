import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {apiStatus: apiStatusConstants.initial, vaccinationData: {}}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inprogress,
    })
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const option = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, option)
    console.log(response)
    const fetchedData = await response.json()
    console.log(fetchedData)
    if (response.ok === true) {
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachVaccinationData => ({
            dose1: eachVaccinationData.dose_1,
            dose2: eachVaccinationData.dose_2,
            vaccineData: eachVaccinationData.vaccine_date,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachRange => ({
          age: eachRange.age,
          count: eachRange.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachDataType => ({
            count: eachDataType.count,
            gender: eachDataType.gender,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationDataView = () => {
    const {vaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoaderView = () => (
    <div className="loading-view" testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderVaccinationDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationDataView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderVaccinationDetailsView()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
