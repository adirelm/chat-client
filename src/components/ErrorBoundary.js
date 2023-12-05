import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>Error: {this.state.error && this.state.error.toString()}</p>
          <pre>
            Error Details:{" "}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}
