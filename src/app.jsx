import { React, Component } from 'react';
import Result from './result.jsx';
import { searchApp } from './searchApp.jsx';
import { getUrlArgs, changeUrlArgs } from './url.jsx';
import './app.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: getUrlArgs('name') || '',
            country: getUrlArgs('country') || 'cn',
            entity: getUrlArgs('entity') || 'software',
            limit: getUrlArgs('limit') || '32',
            cut: getUrlArgs('cut') || '0',
            resolution: getUrlArgs('resolution') || '128',
            format: getUrlArgs('format') || 'png',
            results: [],
        };
        this.search = this.search.bind(this);
        if (getUrlArgs('name') != null) this.search();
    }

    async search() {
        let { name, country, entity, limit, cut, resolution, format } = this.state;
        name = name.trim();
        try {
            const data = await Promise.all([searchApp(name, country, entity, limit)]);
            this.setState({ results: data[0].results, cut: cut, resolution: resolution, format: format });
        } catch (err) {
            console.error(err);
        }
        if (name != '') {
            const params = ['name', 'country', 'entity', 'limit', 'cut', 'resolution', 'format'];
            let newUrl = window.location.href;
            params.forEach(param => {
                newUrl = changeUrlArgs(newUrl, param, this.state[param]);
            });
            history.replaceState(null, null, newUrl);
        } else {
            history.replaceState(null, null, window.location.origin);
        }
    }

    renderOption(key, value, text) {
        return (
            <label onClick={() => this.setState({ [key]: value })} >
                <input name={key} type="checkbox" checked={this.state[key] === value} />
                {text}
            </label>
        );
    }

    render() {
        const { name, cut, resolution, format, results } = this.state;
        const entityMaps = [
            { key: 'entity', value: 'software', text: 'iOS' },
            { key: 'entity', value: 'macSoftware', text: 'MAC' },
        ];
        const countryMaps = [
            { key: 'country', value: 'cn', text: '中/CN' },
            { key: 'country', value: 'us', text: '美/US' },
            { key: 'country', value: 'jp', text: '日/JP' },
            { key: 'country', value: 'kr', text: '韩/KR' },
        ];
        const cutMaps = [
            { key: 'cut', value: '0', text: '原始图像' },
            { key: 'cut', value: '1', text: '圆角图像' },
        ];
        const formatMaps = [
        ];
        const resolutionMaps = [
            { key: 'resolution', value: '32', text: '32px' },
            { key: 'resolution', value: '64', text: '64px' },
            { key: 'resolution', value: '128', text: '128px' },
            { key: 'resolution', value: '256', text: '256px' },
            { key: 'resolution', value: '512', text: '512px' },
        ];
        return (
            <div className="app">
                <header>
                    <div className="center">
                        <div className="logo">亿圣图标</div>
                        <div className="description">苹果高清应用图标</div>
                        <div className="description">圆角仅支持256大小</div>
                        <div className="options">
                            {entityMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="options">
                            {countryMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="search">
                            <input
                                className="search-input"
                                placeholder="应用名称"
                                value={name}
                                onChange={(e) => this.setState({ name: e.target.value.trim() })}
                                onKeyDown={(e) => e.key == 'Enter' ? this.search() : ''} />
                            <div className="search-button" onClick={this.search} >
                                <dev className="search-icon" />
                            </div>
                        </div>
                        <div className="options">
                            {cutMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="options">
                            {formatMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div>
                        <div className="options">
                            {resolutionMaps.map(option => this.renderOption(option.key, option.value, option.text))}
                        </div><br />
                    </div>
                </header>
                <main className="results">
                    {results.map((result) => (<Result key={result.trackId} data={result} cut={cut} resolution={resolution} format={format} />))}
                </main>
                <footer className="footer"><a className="footer-msg" href='https://vvvxi.com'>亿圣导航</a></footer>
            </div>
        );
    }
}

export default App
