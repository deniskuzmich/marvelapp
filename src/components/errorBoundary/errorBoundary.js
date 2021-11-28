import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";


class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: true
        })
    }

    render () {
        if (this.state.error) {
            return <h2><ErrorMessage/></h2>
        }

        
        return this.props.children;
    }
}

export default ErrorBoundary;