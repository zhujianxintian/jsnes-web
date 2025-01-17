import React, { Component } from 'react';
import { Button, Progress } from 'reactstrap';
import { Link } from 'react-router-dom';

import config from '../../utils/config';
import ControlsModal from '../../components/ControlsModal';
import Emulator from '../../components/Emulator';
import RomLibrary from '../../utils/RomLibrary';
import { loadBinary } from '../../utils/utils';

import './index.scss';

/*
 * The UI for the emulator. Also responsible for loading ROM from URL or file.
 */
class RunPage extends Component<any, any> {
    navbar!: HTMLElement | null;
    screenContainer!: HTMLDivElement | null;
    emulator!: Emulator | null;
    currentRequest: any;

    state: any;

    constructor(props: any) {
        super(props);
        this.state = {
            romName: null,
            romData: null,
            running: false,
            paused: false,
            controlsModalOpen: false,
            loading: true,
            loadedPercent: 3,
            error: null,
        };
    }

    render() {
        return (
            <div className="RunPage">
                <nav
                    className="navbar navbar-expand"
                    ref={(el) => {
                        this.navbar = el;
                    }}
                >
                    <ul className="navbar-nav" style={{ width: '200px' }}>
                        <li className="navitem">
                            <Link to="/" className="nav-link">
                                &lsaquo; Back
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto mr-auto">
                        <li className="navitem">
                            <span className="navbar-text mr-3">{this.state.romName}</span>
                        </li>
                    </ul>
                    <ul className="navbar-nav" style={{ width: '200px' }}>
                        <li className="navitem">
                            <Button outline color="primary" onClick={this.toggleControlsModal} className="mr-3">
                                Controls
                            </Button>
                            <Button
                                outline
                                color="primary"
                                onClick={this.handlePauseResume}
                                disabled={!this.state.running}
                            >
                                {this.state.paused ? 'Resume' : 'Pause'}
                            </Button>
                        </li>
                    </ul>
                </nav>

                {this.state.error ? (
                    this.state.error
                ) : (
                    <div
                        className="screen-container"
                        ref={(el) => {
                            this.screenContainer = el;
                        }}
                    >
                        {this.state.loading ? (
                            <Progress
                                value={this.state.loadedPercent}
                                style={{
                                    position: 'absolute',
                                    width: '70%',
                                    left: '15%',
                                    top: '48%',
                                }}
                            />
                        ) : this.state.romData ? (
                            <Emulator
                                romData={this.state.romData}
                                paused={this.state.paused}
                                ref={(emulator) => {
                                    this.emulator = emulator;
                                }}
                            />
                        ) : null}

                        {/* TODO: lift keyboard and gamepad state up */}
                        {this.state.controlsModalOpen && (
                            <ControlsModal
                                isOpen={this.state.controlsModalOpen}
                                toggle={this.toggleControlsModal}
                                keys={this.emulator!.keyboardController!.keys}
                                setKeys={this.emulator!.keyboardController!.setKeys}
                                promptButton={this.emulator!.gamepadController!.promptButton}
                                gamepadConfig={this.emulator!.gamepadController!.gamepadConfig}
                                setGamepadConfig={this.emulator!.gamepadController!.setGamepadConfig}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }

    componentDidMount() {
        window.addEventListener('resize', this.layout);
        this.layout();
        this.load();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.layout);
        if (this.currentRequest) {
            this.currentRequest.abort();
        }
    }

    load = () => {
        if (this.props.match.params.slug) {
            const slug = this.props.match.params.slug;
            const isLocalROM = /^local-/.test(slug);
            const romHash = slug.split('-')[1];
            // @ts-ignore
            const romInfo = isLocalROM ? RomLibrary.getRomInfoByHash(romHash) : config.ROMS[slug];

            if (!romInfo) {
                this.setState({ error: `No such ROM: ${slug}` });
                return;
            }

            if (isLocalROM) {
                this.setState({ romName: romInfo.name });
                const localROMData = localStorage.getItem('blob-' + romHash);
                this.handleLoaded(localROMData);
            } else {
                this.setState({ romName: romInfo.description });
                this.currentRequest = loadBinary(
                    romInfo.url,
                    (err, data) => {
                        if (err) {
                            this.setState({ error: `Error loading ROM: ${err.message}` });
                        } else {
                            this.handleLoaded(data);
                        }
                    },
                    this.handleProgress,
                );
            }
        } else if (this.props.location.state && this.props.location.state.file) {
            let reader = new FileReader();
            reader.readAsBinaryString(this.props.location.state.file);
            reader.onload = (e) => {
                this.currentRequest = null;
                this.handleLoaded(reader.result);
            };
        } else {
            this.setState({ error: 'No ROM provided' });
        }
    };

    handleProgress = (e: { lengthComputable: any; loaded: number; total: number }) => {
        if (e.lengthComputable) {
            this.setState({ loadedPercent: (e.loaded / e.total) * 100 });
        }
    };

    handleLoaded = (data: string | ArrayBuffer | null | undefined) => {
        this.setState({ running: true, loading: false, romData: data });
    };

    handlePauseResume = () => {
        this.setState({ paused: !this.state.paused });
    };

    layout = () => {
        let navbarHeight = parseFloat(window.getComputedStyle(this.navbar!).height);
        this.screenContainer!.style.height = `${window.innerHeight - navbarHeight}px`;
        if (this.emulator) {
            this.emulator.fitInParent();
        }
    };

    toggleControlsModal = () => {
        this.setState({ controlsModalOpen: !this.state.controlsModalOpen });
    };
}

export default RunPage;
