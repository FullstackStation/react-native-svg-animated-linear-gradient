import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {View, StyleSheet, Animated} from 'react-native';

//import Expo, { Svg } from 'expo';
import Svg, {
    Circle,
    ClipPath,
    G,
    LinearGradient,
    Rect,
    Defs,
    Stop
}  from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const {interpolate} = require('d3-interpolate');

export default class SvgAnimatedLinearGradient extends Component {
    constructor(props) {
        super(props);

        const initialOffsetValues = props.offset
            ? [1, 1 + props.offset / 2, 1 + props.offset]
            : [1, 1.5, 2];
        this.state = {
            initialOffsetValues,
            offsetValues: [...initialOffsetValues].reverse().map(v => String(v * -1)),
            offsets: [
                '0.0001', '0.0002', '0.0003' // Avoid duplicate value cause error in Android
            ],
            frequence: props.duration / 2,
            useNativeDriver: props.useNativeDriver
        }
        this._isMounted = false;
        this._animate = new Animated.Value(0)
        this.loopAnimation = this
            .loopAnimation
            .bind(this)
    }
    offsetValueBound(x) {
        if (x > 1) {
            return '1'
        }
        if (x < 0) {
            return '0'
        }
        return x
    }
    componentDidMount(props) {
        this._isMounted = true
        this.loopAnimation()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    loopAnimation() {
        if (!this._isMounted) return;
        // setup interpolate
        let interpolator = interpolate(this.state, {
            offsetValues: this.state.initialOffsetValues.map(v => String(v))
        });

        // start animation
        let start = Date.now();
        this._animation = () => {
            const now = Date.now();
            let t = (now - start) / this.props.duration;
            if (t > 1) {
                t = 1
            }

            let newState = interpolator(t);
            let offsetValues = [];
            offsetValues[0] = this.offsetValueBound(newState.offsetValues[0]);
            offsetValues[1] = this.offsetValueBound(newState.offsetValues[1]);
            offsetValues[2] = this.offsetValueBound(newState.offsetValues[2]);
            
            // Make sure at least two offsets is different
            if (offsetValues[0] !== offsetValues[1] || offsetValues[0] !==  offsetValues[2] || offsetValues[1] !== offsetValues[2]) {
                this._isMounted && this.setState({offsets: offsetValues});
            }
            if (t < 1) {
                requestAnimationFrame(this._animation);
            }
        }
        requestAnimationFrame(this._animation);

        // Setup loop animation
        Animated.sequence([
            Animated.timing(this._animate, {
                toValue: 1,
                duration: this.state.frequence,
                useNativeDriver: this.state.useNativeDriver
            }),
            Animated.timing(this._animate, {
                toValue: 0,
                duration: this.state.frequence,
                useNativeDriver: this.state.useNativeDriver
            })
        ]).start((event) => {
            if (event.finished) {
                this.loopAnimation()
            }
        })
    }
    render() {

        return (
            <AnimatedSvg {...this.props}>
                <Defs>
                    <LinearGradient id="grad" x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}>
                        <Stop
                            offset={this.state.offsets[0]}
                            stopColor={this.props.primaryColor}
                            stopOpacity="1"/>
                        <Stop
                            offset={this.state.offsets[1]}
                            stopColor={this.props.secondaryColor}
                            stopOpacity="1"/>
                        <Stop
                            offset={this.state.offsets[2]}
                            stopColor={this.props.primaryColor}
                            stopOpacity="1"/>
                    </LinearGradient>
                    <ClipPath id="clip">
                        <G>
                            {this.props.children}
                        </G>
                    </ClipPath>
                </Defs>

                <Rect
                    x="0"
                    y="0"
                    height={this.props.height}
                    width={this.props.width}
                    fill="url(#grad)"
                    clipPath="url(#clip)"/>
            </AnimatedSvg>
        );
    }
}
SvgAnimatedLinearGradient.propTypes = {
    primaryColor: PropTypes.string,
    secondaryColor: PropTypes.string,
    duration: PropTypes.number,
    useNativeDriver: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    x1: PropTypes.string,
    y1: PropTypes.string,
    x2: PropTypes.string,
    y2: PropTypes.string,
}
SvgAnimatedLinearGradient.defaultProps = {
    primaryColor: '#eeeeee',
    secondaryColor: '#dddddd',
    duration: 2000,
    useNativeDriver: true,
    width: 300,
    height: 200,
    x1: '0',
    y1: '0',
    x2: '100%',
    y2: '0',
    offset: 1,
}
