import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import '../App.css';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';

import BootstrapTable from 'react-bootstrap-table-next';
import ToggleButton from 'react-toggle-button';








export default class Index extends Component {
    state = {
        data: false,
        disease: '',
        drug: '',
        papers: [],
        papersPerYear: [],
        displayToggle: false,
        displayPerYear: false
    };

    handleDiseaseChange = e => {
        const disease = e.target.value;
        this.setState({ disease: disease })
    }

    handleDrugChange = e => {
        const drug = e.target.value;
        this.setState({ drug: drug })
    }

    papersPerYear = (papers) => {
        let papersPerYear = {}
        papers.forEach(paper => {
            if(paper.date != null)
            {
                let year = paper.date.split('-')[0];
                if (year in papersPerYear)
                    papersPerYear[year]++;
                else
                    papersPerYear[year] = 1;
            }
        });
        this.setState({papersPerYear : papersPerYear});
    }

    printPapersPerYear = () => {
        var rows = [];
        for( const [year,papers] of Object.entries(this.state.papersPerYear) )
        {
            rows.push(
                {
                    Year : year ,
                    Papers : papers
                }
            )
        }
        console.log(rows);

        let columns = []
        Object.keys(rows['0']).forEach(x => {
            columns.push({ dataField: x, text: x });
        });

        let res = <BootstrapTable keyField='id' data={rows} columns={columns} />;
        return res;
    }


    handleSubmit = e => {
        console.log(`http://localhost:8765/papers/${this.state.drug}/${this.state.disease}/`);
        axios.get(`http://localhost:8765/papers/${this.state.drug}/${this.state.disease}/`)
            .then(response => {
                const papers = response.data;
                this.setState({ data: true, papers: papers, displayToggle: true });
                this.papersPerYear(papers);
            })
            .catch(error => {
                this.setState({ data: false , displayToggle:false });
            });
    };


    printTable = () => {
        var rows = this.state.papers;
        let columns = []
        Object.keys(this.state.papers['0']).forEach(x => {
            columns.push({ dataField: x, text: x });
        });
        const pagination = paginationFactory({
            sizePerPage: 5,
            sizePerPageList: [
                { text: '5', value: 5 },
                { text: '10', value: 10 }
            ],
            withFirstAndLast: false,
            alwaysShowAllBtns: false
        });

        let res = <BootstrapTable keyField='id' data={rows} columns={columns} pagination={pagination} />;
        return res;
    }


    render() {
        return (
            <div>
                <div id="wrapper">
                    <div id="content-wrapper">
                        <div className="input-group" >
                            <Form>
                                <FormGroup>
                                    <Input type="text" name="disease" id="disease" placeholder="Disease" onChange={this.handleDiseaseChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="text" name="drug" id="drug" placeholder="Drug" onChange={this.handleDrugChange} />
                                </FormGroup>
                            </Form>
                        </div>
                        <Button variant="dark" onClick={this.handleSubmit}>Search</Button>

                        <br/>
                        <br/>
                        {this.state.displayToggle ? (
                            <Label>
                                Display papers per Year?
                            </Label>
                        ) : null}

                        {this.state.displayToggle ? (
                            <ToggleButton
                                value={ this.state.displayPerYear || false }
                                onToggle={(value) => 
                                    {
                                    this.setState({ displayPerYear: !value })
                                    }}
                            />
                        ) : null}

                        <br/>
                        <br/>


                        <div class='wrapperClasses'>
                            {this.state.data && !this.state.displayPerYear ? (this.printTable()) : ('')}
                            {this.state.data && this.state.displayPerYear ? (this.printPapersPerYear()) : ('')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}