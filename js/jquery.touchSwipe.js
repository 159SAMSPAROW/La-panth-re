/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
/*! function(factory) {
    "function" == typeof define && define.amd && define.amd.jQuery ? define(["jquery"], factory) : factory("undefined" != typeof module && module.exports ? require("jquery") : jQuery)
}(function($) {
    "use strict";

    function init(options) {
        return !options || void 0 !== options.allowPageScroll || void 0 === options.swipe && void 0 === options.swipeStatus || (options.allowPageScroll = NONE), void 0 !== options.click && void 0 === options.tap && (options.tap = options.click), options || (options = {}), options = $.extend({}, $.fn.swipe.defaults, options), this.each(function() {
            var $this = $(this),
                plugin = $this.data(PLUGIN_NS);
            plugin || (plugin = new TouchSwipe(this, options), $this.data(PLUGIN_NS, plugin))
        })
    }

    function TouchSwipe(element, options) {
        function touchStart(jqEvent) {
            if (!(getTouchInProgress() || $(jqEvent.target).closest(options.excludedElements, $element).length > 0)) {
                var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
                if (!event.pointerType || "mouse" != event.pointerType || 0 != options.fallbackToMouseEvents) {
                    var ret, touches = event.touches,
                        evt = touches ? touches[0] : event;
                    return phase = PHASE_START, touches ? fingerCount = touches.length : options.preventDefaultEvents !== !1 && jqEvent.preventDefault(), distance = 0, direction = null, currentDirection = null, pinchDirection = null, duration = 0, startTouchesDistance = 0, endTouchesDistance = 0, pinchZoom = 1, pinchDistance = 0, maximumsMap = createMaximumsData(), cancelMultiFingerRelease(), createFingerData(0, evt), !touches || fingerCount === options.fingers || options.fingers === ALL_FINGERS || hasPinches() ? (startTime = getTimeStamp(), 2 == fingerCount && (createFingerData(1, touches[1]), startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)), (options.swipeStatus || options.pinchStatus) && (ret = triggerHandler(event, phase))) : ret = !1, ret === !1 ? (phase = PHASE_CANCEL, triggerHandler(event, phase), ret) : (options.hold && (holdTimeout = setTimeout($.proxy(function() {
                        $element.trigger("hold", [event.target]), options.hold && (ret = options.hold.call($element, event, event.target))
                    }, this), options.longTapThreshold)), setTouchInProgress(!0), null)
                }
            }
        }

        function touchMove(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            if (phase !== PHASE_END && phase !== PHASE_CANCEL && !inMultiFingerRelease()) {
                var ret, touches = event.touches,
                    evt = touches ? touches[0] : event,
                    currentFinger = updateFingerData(evt);
                if (endTime = getTimeStamp(), touches && (fingerCount = touches.length), options.hold && clearTimeout(holdTimeout), phase = PHASE_MOVE, 2 == fingerCount && (0 == startTouchesDistance ? (createFingerData(1, touches[1]), startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)) : (updateFingerData(touches[1]), endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end), pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end)), pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance), pinchDistance = Math.abs(startTouchesDistance - endTouchesDistance)), fingerCount === options.fingers || options.fingers === ALL_FINGERS || !touches || hasPinches()) {
                    if (direction = calculateDirection(currentFinger.start, currentFinger.end), currentDirection = calculateDirection(currentFinger.last, currentFinger.end), validateDefaultEvent(jqEvent, currentDirection), distance = calculateDistance(currentFinger.start, currentFinger.end), duration = calculateDuration(), setMaxDistance(direction, distance), ret = triggerHandler(event, phase), !options.triggerOnTouchEnd || options.triggerOnTouchLeave) {
                        var inBounds = !0;
                        if (options.triggerOnTouchLeave) {
                            var bounds = getbounds(this);
                            inBounds = isInBounds(currentFinger.end, bounds)
                        }!options.triggerOnTouchEnd && inBounds ? phase = getNextPhase(PHASE_MOVE) : options.triggerOnTouchLeave && !inBounds && (phase = getNextPhase(PHASE_END)), phase != PHASE_CANCEL && phase != PHASE_END || triggerHandler(event, phase)
                    }
                } else phase = PHASE_CANCEL, triggerHandler(event, phase);
                ret === !1 && (phase = PHASE_CANCEL, triggerHandler(event, phase))
            }
        }

        function touchEnd(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent,
                touches = event.touches;
            if (touches) {
                if (touches.length && !inMultiFingerRelease()) return startMultiFingerRelease(event), !0;
                if (touches.length && inMultiFingerRelease()) return !0
            }
            return inMultiFingerRelease() && (fingerCount = fingerCountAtRelease), endTime = getTimeStamp(), duration = calculateDuration(), didSwipeBackToCancel() || !validateSwipeDistance() ? (phase = PHASE_CANCEL, triggerHandler(event, phase)) : options.triggerOnTouchEnd || options.triggerOnTouchEnd === !1 && phase === PHASE_MOVE ? (options.preventDefaultEvents !== !1 && jqEvent.cancelable !== !1 && jqEvent.preventDefault(), phase = PHASE_END, triggerHandler(event, phase)) : !options.triggerOnTouchEnd && hasTap() ? (phase = PHASE_END, triggerHandlerForGesture(event, phase, TAP)) : phase === PHASE_MOVE && (phase = PHASE_CANCEL, triggerHandler(event, phase)), setTouchInProgress(!1), null
        }

        function touchCancel() {
            fingerCount = 0, endTime = 0, startTime = 0, startTouchesDistance = 0, endTouchesDistance = 0, pinchZoom = 1, cancelMultiFingerRelease(), setTouchInProgress(!1)
        }

        function touchLeave(jqEvent) {
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
            options.triggerOnTouchLeave && (phase = getNextPhase(PHASE_END), triggerHandler(event, phase))
        }

        function removeListeners() {
            $element.unbind(START_EV, touchStart), $element.unbind(CANCEL_EV, touchCancel), $element.unbind(MOVE_EV, touchMove), $element.unbind(END_EV, touchEnd), LEAVE_EV && $element.unbind(LEAVE_EV, touchLeave), setTouchInProgress(!1)
        }

        function getNextPhase(currentPhase) {
            var nextPhase = currentPhase,
                validTime = validateSwipeTime(),
                validDistance = validateSwipeDistance(),
                didCancel = didSwipeBackToCancel();
            return !validTime || didCancel ? nextPhase = PHASE_CANCEL : !validDistance || currentPhase != PHASE_MOVE || options.triggerOnTouchEnd && !options.triggerOnTouchLeave ? !validDistance && currentPhase == PHASE_END && options.triggerOnTouchLeave && (nextPhase = PHASE_CANCEL) : nextPhase = PHASE_END, nextPhase
        }

        function triggerHandler(event, phase) {
            var ret, touches = event.touches;
            return (didSwipe() || hasSwipes()) && (ret = triggerHandlerForGesture(event, phase, SWIPE)), (didPinch() || hasPinches()) && ret !== !1 && (ret = triggerHandlerForGesture(event, phase, PINCH)), didDoubleTap() && ret !== !1 ? ret = triggerHandlerForGesture(event, phase, DOUBLE_TAP) : didLongTap() && ret !== !1 ? ret = triggerHandlerForGesture(event, phase, LONG_TAP) : didTap() && ret !== !1 && (ret = triggerHandlerForGesture(event, phase, TAP)), phase === PHASE_CANCEL && touchCancel(event), phase === PHASE_END && (touches ? touches.length || touchCancel(event) : touchCancel(event)), ret
        }

        function triggerHandlerForGesture(event, phase, gesture) {
            var ret;
            if (gesture == SWIPE) {
                if ($element.trigger("swipeStatus", [phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection]), options.swipeStatus && (ret = options.swipeStatus.call($element, event, phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection), ret === !1)) return !1;
                if (phase == PHASE_END && validateSwipe()) {
                    if (clearTimeout(singleTapTimeout), clearTimeout(holdTimeout), $element.trigger("swipe", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipe && (ret = options.swipe.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection), ret === !1)) return !1;
                    switch (direction) {
                        case LEFT:
                            $element.trigger("swipeLeft", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeLeft && (ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                            break;
                        case RIGHT:
                            $element.trigger("swipeRight", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeRight && (ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                            break;
                        case UP:
                            $element.trigger("swipeUp", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeUp && (ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
                            break;
                        case DOWN:
                            $element.trigger("swipeDown", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeDown && (ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection))
                    }
                }
            }
            if (gesture == PINCH) {
                if ($element.trigger("pinchStatus", [phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]), options.pinchStatus && (ret = options.pinchStatus.call($element, event, phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData), ret === !1)) return !1;
                if (phase == PHASE_END && validatePinch()) switch (pinchDirection) {
                    case IN:
                        $element.trigger("pinchIn", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]), options.pinchIn && (ret = options.pinchIn.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData));
                        break;
                    case OUT:
                        $element.trigger("pinchOut", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]), options.pinchOut && (ret = options.pinchOut.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData))
                }
            }
            return gesture == TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout), clearTimeout(holdTimeout), hasDoubleTap() && !inDoubleTap() ? (doubleTapStartTime = getTimeStamp(), singleTapTimeout = setTimeout($.proxy(function() {
                doubleTapStartTime = null, $element.trigger("tap", [event.target]), options.tap && (ret = options.tap.call($element, event, event.target))
            }, this), options.doubleTapThreshold)) : (doubleTapStartTime = null, $element.trigger("tap", [event.target]), options.tap && (ret = options.tap.call($element, event, event.target)))) : gesture == DOUBLE_TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout), clearTimeout(holdTimeout), doubleTapStartTime = null, $element.trigger("doubletap", [event.target]), options.doubleTap && (ret = options.doubleTap.call($element, event, event.target))) : gesture == LONG_TAP && (phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout), doubleTapStartTime = null, $element.trigger("longtap", [event.target]), options.longTap && (ret = options.longTap.call($element, event, event.target)))), ret
        }

        function validateSwipeDistance() {
            var valid = !0;
            return null !== options.threshold && (valid = distance >= options.threshold), valid
        }

        function didSwipeBackToCancel() {
            var cancelled = !1;
            return null !== options.cancelThreshold && null !== direction && (cancelled = getMaxDistance(direction) - distance >= options.cancelThreshold), cancelled
        }

        function validatePinchDistance() {
            return null === options.pinchThreshold || pinchDistance >= options.pinchThreshold
        }

        function validateSwipeTime() {
            var result;
            return result = !options.maxTimeThreshold || !(duration >= options.maxTimeThreshold)
        }

        function validateDefaultEvent(jqEvent, direction) {
            if (options.preventDefaultEvents !== !1)
                if (options.allowPageScroll === NONE) jqEvent.preventDefault();
                else {
                    var auto = options.allowPageScroll === AUTO;
                    switch (direction) {
                        case LEFT:
                            (options.swipeLeft && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
                            break;
                        case RIGHT:
                            (options.swipeRight && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
                            break;
                        case UP:
                            (options.swipeUp && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault();
                            break;
                        case DOWN:
                            (options.swipeDown && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault();
                            break;
                        case NONE:
                    }
                }
        }

        function validatePinch() {
            var hasCorrectFingerCount = validateFingers(),
                hasEndPoint = validateEndPoint(),
                hasCorrectDistance = validatePinchDistance();
            return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance
        }

        function hasPinches() {
            return !!(options.pinchStatus || options.pinchIn || options.pinchOut)
        }

        function didPinch() {
            return !(!validatePinch() || !hasPinches())
        }

        function validateSwipe() {
            var hasValidTime = validateSwipeTime(),
                hasValidDistance = validateSwipeDistance(),
                hasCorrectFingerCount = validateFingers(),
                hasEndPoint = validateEndPoint(),
                didCancel = didSwipeBackToCancel(),
                valid = !didCancel && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime;
            return valid
        }

        function hasSwipes() {
            return !!(options.swipe || options.swipeStatus || options.swipeLeft || options.swipeRight || options.swipeUp || options.swipeDown)
        }

        function didSwipe() {
            return !(!validateSwipe() || !hasSwipes())
        }

        function validateFingers() {
            return fingerCount === options.fingers || options.fingers === ALL_FINGERS || !SUPPORTS_TOUCH
        }

        function validateEndPoint() {
            return 0 !== fingerData[0].end.x
        }

        function hasTap() {
            return !!options.tap
        }

        function hasDoubleTap() {
            return !!options.doubleTap
        }

        function hasLongTap() {
            return !!options.longTap
        }

        function validateDoubleTap() {
            if (null == doubleTapStartTime) return !1;
            var now = getTimeStamp();
            return hasDoubleTap() && now - doubleTapStartTime <= options.doubleTapThreshold
        }

        function inDoubleTap() {
            return validateDoubleTap()
        }

        function validateTap() {
            return (1 === fingerCount || !SUPPORTS_TOUCH) && (isNaN(distance) || distance < options.threshold)
        }

        function validateLongTap() {
            return duration > options.longTapThreshold && distance < DOUBLE_TAP_THRESHOLD
        }

        function didTap() {
            return !(!validateTap() || !hasTap())
        }

        function didDoubleTap() {
            return !(!validateDoubleTap() || !hasDoubleTap())
        }

        function didLongTap() {
            return !(!validateLongTap() || !hasLongTap())
        }

        function startMultiFingerRelease(event) {
            previousTouchEndTime = getTimeStamp(), fingerCountAtRelease = event.touches.length + 1
        }

        function cancelMultiFingerRelease() {
            previousTouchEndTime = 0, fingerCountAtRelease = 0
        }

        function inMultiFingerRelease() {
            var withinThreshold = !1;
            if (previousTouchEndTime) {
                var diff = getTimeStamp() - previousTouchEndTime;
                diff <= options.fingerReleaseThreshold && (withinThreshold = !0)
            }
            return withinThreshold
        }

        function getTouchInProgress() {
            return !($element.data(PLUGIN_NS + "_intouch") !== !0)
        }

        function setTouchInProgress(val) {
            $element && (val === !0 ? ($element.bind(MOVE_EV, touchMove), $element.bind(END_EV, touchEnd), LEAVE_EV && $element.bind(LEAVE_EV, touchLeave)) : ($element.unbind(MOVE_EV, touchMove, !1), $element.unbind(END_EV, touchEnd, !1), LEAVE_EV && $element.unbind(LEAVE_EV, touchLeave, !1)), $element.data(PLUGIN_NS + "_intouch", val === !0))
        }

        function createFingerData(id, evt) {
            var f = {
                start: {
                    x: 0,
                    y: 0
                },
                last: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            };
            return f.start.x = f.last.x = f.end.x = evt.pageX || evt.clientX, f.start.y = f.last.y = f.end.y = evt.pageY || evt.clientY, fingerData[id] = f, f
        }

        function updateFingerData(evt) {
            var id = void 0 !== evt.identifier ? evt.identifier : 0,
                f = getFingerData(id);
            return null === f && (f = createFingerData(id, evt)), f.last.x = f.end.x, f.last.y = f.end.y, f.end.x = evt.pageX || evt.clientX, f.end.y = evt.pageY || evt.clientY, f
        }

        function getFingerData(id) {
            return fingerData[id] || null
        }

        function setMaxDistance(direction, distance) {
            direction != NONE && (distance = Math.max(distance, getMaxDistance(direction)), maximumsMap[direction].distance = distance)
        }

        function getMaxDistance(direction) {
            if (maximumsMap[direction]) return maximumsMap[direction].distance
        }

        function createMaximumsData() {
            var maxData = {};
            return maxData[LEFT] = createMaximumVO(LEFT), maxData[RIGHT] = createMaximumVO(RIGHT), maxData[UP] = createMaximumVO(UP), maxData[DOWN] = createMaximumVO(DOWN), maxData
        }

        function createMaximumVO(dir) {
            return {
                direction: dir,
                distance: 0
            }
        }

        function calculateDuration() {
            return endTime - startTime
        }

        function calculateTouchesDistance(startPoint, endPoint) {
            var diffX = Math.abs(startPoint.x - endPoint.x),
                diffY = Math.abs(startPoint.y - endPoint.y);
            return Math.round(Math.sqrt(diffX * diffX + diffY * diffY))
        }

        function calculatePinchZoom(startDistance, endDistance) {
            var percent = endDistance / startDistance * 1;
            return percent.toFixed(2)
        }

        function calculatePinchDirection() {
            return pinchZoom < 1 ? OUT : IN
        }

        function calculateDistance(startPoint, endPoint) {
            return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)))
        }

        function calculateAngle(startPoint, endPoint) {
            var x = startPoint.x - endPoint.x,
                y = endPoint.y - startPoint.y,
                r = Math.atan2(y, x),
                angle = Math.round(180 * r / Math.PI);
            return angle < 0 && (angle = 360 - Math.abs(angle)), angle
        }

        function calculateDirection(startPoint, endPoint) {
            if (comparePoints(startPoint, endPoint)) return NONE;
            var angle = calculateAngle(startPoint, endPoint);
            return angle <= 45 && angle >= 0 ? LEFT : angle <= 360 && angle >= 315 ? LEFT : angle >= 135 && angle <= 225 ? RIGHT : angle > 45 && angle < 135 ? DOWN : UP
        }

        function getTimeStamp() {
            var now = new Date;
            return now.getTime()
        }

        function getbounds(el) {
            el = $(el);
            var offset = el.offset(),
                bounds = {
                    left: offset.left,
                    right: offset.left + el.outerWidth(),
                    top: offset.top,
                    bottom: offset.top + el.outerHeight()
                };
            return bounds
        }

        function isInBounds(point, bounds) {
            return point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom
        }

        function comparePoints(pointA, pointB) {
            return pointA.x == pointB.x && pointA.y == pointB.y
        }
        var options = $.extend({}, options),
            useTouchEvents = SUPPORTS_TOUCH || SUPPORTS_POINTER || !options.fallbackToMouseEvents,
            START_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerDown" : "pointerdown" : "touchstart" : "mousedown",
            MOVE_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerMove" : "pointermove" : "touchmove" : "mousemove",
            END_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerUp" : "pointerup" : "touchend" : "mouseup",
            LEAVE_EV = useTouchEvents ? SUPPORTS_POINTER ? "mouseleave" : null : "mouseleave",
            CANCEL_EV = SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerCancel" : "pointercancel" : "touchcancel",
            distance = 0,
            direction = null,
            currentDirection = null,
            duration = 0,
            startTouchesDistance = 0,
            endTouchesDistance = 0,
            pinchZoom = 1,
            pinchDistance = 0,
            pinchDirection = 0,
            maximumsMap = null,
            $element = $(element),
            phase = "start",
            fingerCount = 0,
            fingerData = {},
            startTime = 0,
            endTime = 0,
            previousTouchEndTime = 0,
            fingerCountAtRelease = 0,
            doubleTapStartTime = 0,
            singleTapTimeout = null,
            holdTimeout = null;
        try {
            $element.bind(START_EV, touchStart), $element.bind(CANCEL_EV, touchCancel)
        } catch (e) {
            $.error("events not supported " + START_EV + "," + CANCEL_EV + " on jQuery.swipe")
        }
        this.enable = function() {
            return this.disable(), $element.bind(START_EV, touchStart), $element.bind(CANCEL_EV, touchCancel), $element
        }, this.disable = function() {
            return removeListeners(), $element
        }, this.destroy = function() {
            removeListeners(), $element.data(PLUGIN_NS, null), $element = null
        }, this.option = function(property, value) {
            if ("object" == typeof property) options = $.extend(options, property);
            else if (void 0 !== options[property]) {
                if (void 0 === value) return options[property];
                options[property] = value
            } else {
                if (!property) return options;
                $.error("Option " + property + " does not exist on jQuery.swipe.options")
            }
            return null
        }
    }
    var VERSION = "1.6.18",
        LEFT = "left",
        RIGHT = "right",
        UP = "up",
        DOWN = "down",
        IN = "in",
        OUT = "out",
        NONE = "none",
        AUTO = "auto",
        SWIPE = "swipe",
        PINCH = "pinch",
        TAP = "tap",
        DOUBLE_TAP = "doubletap",
        LONG_TAP = "longtap",
        HORIZONTAL = "horizontal",
        VERTICAL = "vertical",
        ALL_FINGERS = "all",
        DOUBLE_TAP_THRESHOLD = 10,
        PHASE_START = "start",
        PHASE_MOVE = "move",
        PHASE_END = "end",
        PHASE_CANCEL = "cancel",
        SUPPORTS_TOUCH = "ontouchstart" in window,
        SUPPORTS_POINTER_IE10 = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled && !SUPPORTS_TOUCH,
        SUPPORTS_POINTER = (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && !SUPPORTS_TOUCH,
        PLUGIN_NS = "TouchSwipe",
        defaults = {
            fingers: 1,
            threshold: 75,
            cancelThreshold: null,
            pinchThreshold: 20,
            maxTimeThreshold: null,
            fingerReleaseThreshold: 250,
            longTapThreshold: 500,
            doubleTapThreshold: 200,
            swipe: null,
            swipeLeft: null,
            swipeRight: null,
            swipeUp: null,
            swipeDown: null,
            swipeStatus: null,
            pinchIn: null,
            pinchOut: null,
            pinchStatus: null,
            click: null,
            tap: null,
            doubleTap: null,
            longTap: null,
            hold: null,
            triggerOnTouchEnd: !0,
            triggerOnTouchLeave: !1,
            allowPageScroll: "auto",
            fallbackToMouseEvents: !0,
            excludedElements: ".noSwipe",
            preventDefaultEvents: !0
        };
    $.fn.swipe = function(method) {
        var $this = $(this),
            plugin = $this.data(PLUGIN_NS);
        if (plugin && "string" == typeof method) {
            if (plugin[method]) return plugin[method].apply(plugin, Array.prototype.slice.call(arguments, 1));
            $.error("Method " + method + " does not exist on jQuery.swipe")
        } else if (plugin && "object" == typeof method) plugin.option.apply(plugin, arguments);
        else if (!(plugin || "object" != typeof method && method)) return init.apply(this, arguments);
        return $this
    }, $.fn.swipe.version = VERSION, $.fn.swipe.defaults = defaults, $.fn.swipe.phases = {
        PHASE_START: PHASE_START,
        PHASE_MOVE: PHASE_MOVE,
        PHASE_END: PHASE_END,
        PHASE_CANCEL: PHASE_CANCEL
    }, $.fn.swipe.directions = {
        LEFT: LEFT,
        RIGHT: RIGHT,
        UP: UP,
        DOWN: DOWN,
        IN: IN,
        OUT: OUT
    }, $.fn.swipe.pageScroll = {
        NONE: NONE,
        HORIZONTAL: HORIZONTAL,
        VERTICAL: VERTICAL,
        AUTO: AUTO
    }, $.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        ALL: ALL_FINGERS
    }
});*/
!function(e){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],e):e("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}((function(e){"use strict";function n(n){return!n||void 0!==n.allowPageScroll||void 0===n.swipe&&void 0===n.swipeStatus||(n.allowPageScroll=s),void 0!==n.click&&void 0===n.tap&&(n.tap=n.click),n||(n={}),n=e.extend({},e.fn.swipe.defaults,n),this.each((function(){var i=e(this),r=i.data(D);r||(r=new t(this,n),i.data(D,r))}))}function t(n,t){function P(n){if(!(!0===me.data(D+"_intouch")||e(n.target).closest(t.excludedElements,me).length>0)){var a=n.originalEvent?n.originalEvent:n;if(!a.pointerType||"mouse"!=a.pointerType||0!=t.fallbackToMouseEvents){var u,s=a.touches,c=s?s[0]:a;return xe=y,s?Se=s.length:!1!==t.preventDefaultEvents&&n.preventDefault(),he=0,de=null,fe=null,ye=null,ge=0,we=0,ve=0,Te=1,be=0,(p={})[i]=ne(i),p[r]=ne(r),p[l]=ne(l),p[o]=ne(o),Ee=p,Z(),K(0,c),!s||Se===t.fingers||t.fingers===T||C()?(Me=le(),2==Se&&(K(1,s[1]),we=ve=ie(Oe[0].start,Oe[1].start)),(t.swipeStatus||t.pinchStatus)&&(u=j(a,xe))):u=!1,!1===u?(j(a,xe=x),u):(t.hold&&(Ae=setTimeout(e.proxy((function(){me.trigger("hold",[a.target]),t.hold&&(u=t.hold.call(me,a,a.target))}),this),t.longTapThreshold)),J(!0),null)}}var p}function L(n){var p,h,d,f,g=n.originalEvent?n.originalEvent:n;if(xe!==m&&xe!==x&&!B()){var b,y=g.touches,S=$(y?y[0]:g);if(De=le(),y&&(Se=y.length),t.hold&&clearTimeout(Ae),xe=E,2==Se&&(0==we?(K(1,y[1]),we=ve=ie(Oe[0].start,Oe[1].start)):($(y[1]),ve=ie(Oe[0].end,Oe[1].end),Oe[0].end,Oe[1].end,ye=Te<1?u:a),Te=(ve/we*1).toFixed(2),be=Math.abs(we-ve)),Se===t.fingers||t.fingers===T||!y||C()){if(de=re(S.start,S.end),function(e,n){if(!1!==t.preventDefaultEvents)if(t.allowPageScroll===s)e.preventDefault();else{var a=t.allowPageScroll===c;switch(n){case i:(t.swipeLeft&&a||!a&&t.allowPageScroll!=w)&&e.preventDefault();break;case r:(t.swipeRight&&a||!a&&t.allowPageScroll!=w)&&e.preventDefault();break;case l:(t.swipeUp&&a||!a&&t.allowPageScroll!=v)&&e.preventDefault();break;case o:(t.swipeDown&&a||!a&&t.allowPageScroll!=v)&&e.preventDefault()}}}(n,fe=re(S.last,S.end)),d=S.start,f=S.end,he=Math.round(Math.sqrt(Math.pow(f.x-d.x,2)+Math.pow(f.y-d.y,2))),ge=te(),function(e,n){e!=s&&(n=Math.max(n,ee(e)),Ee[e].distance=n)}(de,he),b=j(g,xe),!t.triggerOnTouchEnd||t.triggerOnTouchLeave){var O=!0;if(t.triggerOnTouchLeave){var M={left:(h=(p=e(p=this)).offset()).left,right:h.left+p.outerWidth(),top:h.top,bottom:h.top+p.outerHeight()};O=function(e,n){return e.x>n.left&&e.x<n.right&&e.y>n.top&&e.y<n.bottom}(S.end,M)}!t.triggerOnTouchEnd&&O?xe=U(E):t.triggerOnTouchLeave&&!O&&(xe=U(m)),xe!=x&&xe!=m||j(g,xe)}}else j(g,xe=x);!1===b&&j(g,xe=x)}}function R(e){var n=e.originalEvent?e.originalEvent:e,i=n.touches;if(i){if(i.length&&!B())return function(e){Pe=le(),Le=e.touches.length+1}(n),!0;if(i.length&&B())return!0}return B()&&(Se=Le),De=le(),ge=te(),_()||!H()?j(n,xe=x):t.triggerOnTouchEnd||!1===t.triggerOnTouchEnd&&xe===E?(!1!==t.preventDefaultEvents&&!1!==e.cancelable&&e.preventDefault(),j(n,xe=m)):!t.triggerOnTouchEnd&&W()?N(n,xe=m,d):xe===E&&j(n,xe=x),J(!1),null}function k(){Se=0,De=0,Me=0,we=0,ve=0,Te=1,Z(),J(!1)}function A(e){var n=e.originalEvent?e.originalEvent:e;t.triggerOnTouchLeave&&j(n,xe=U(m))}function I(){me.unbind(ae,P),me.unbind(pe,k),me.unbind(ue,L),me.unbind(se,R),ce&&me.unbind(ce,A),J(!1)}function U(e){var n=e,i=q(),r=H(),l=_();return!i||l?n=x:!r||e!=E||t.triggerOnTouchEnd&&!t.triggerOnTouchLeave?!r&&e==m&&t.triggerOnTouchLeave&&(n=x):n=m,n}function j(e,n){var i,r=e.touches;return(!(!F()||!X())||X())&&(i=N(e,n,p)),(!(!Q()||!C())||C())&&!1!==i&&(i=N(e,n,h)),G()&&z()&&!1!==i?i=N(e,n,f):ge>t.longTapThreshold&&he<b&&t.longTap&&!1!==i?i=N(e,n,g):!(1!==Se&&S||!(isNaN(he)||he<t.threshold)||!W())&&!1!==i&&(i=N(e,n,d)),n===x&&k(),n===m&&(r&&r.length||k()),i}function N(n,s,c){var w;if(c==p){if(me.trigger("swipeStatus",[s,de||null,he||0,ge||0,Se,Oe,fe]),t.swipeStatus&&!1===(w=t.swipeStatus.call(me,n,s,de||null,he||0,ge||0,Se,Oe,fe)))return!1;if(s==m&&F()){if(clearTimeout(ke),clearTimeout(Ae),me.trigger("swipe",[de,he,ge,Se,Oe,fe]),t.swipe&&!1===(w=t.swipe.call(me,n,de,he,ge,Se,Oe,fe)))return!1;switch(de){case i:me.trigger("swipeLeft",[de,he,ge,Se,Oe,fe]),t.swipeLeft&&(w=t.swipeLeft.call(me,n,de,he,ge,Se,Oe,fe));break;case r:me.trigger("swipeRight",[de,he,ge,Se,Oe,fe]),t.swipeRight&&(w=t.swipeRight.call(me,n,de,he,ge,Se,Oe,fe));break;case l:me.trigger("swipeUp",[de,he,ge,Se,Oe,fe]),t.swipeUp&&(w=t.swipeUp.call(me,n,de,he,ge,Se,Oe,fe));break;case o:me.trigger("swipeDown",[de,he,ge,Se,Oe,fe]),t.swipeDown&&(w=t.swipeDown.call(me,n,de,he,ge,Se,Oe,fe))}}}if(c==h){if(me.trigger("pinchStatus",[s,ye||null,be||0,ge||0,Se,Te,Oe]),t.pinchStatus&&!1===(w=t.pinchStatus.call(me,n,s,ye||null,be||0,ge||0,Se,Te,Oe)))return!1;if(s==m&&Q())switch(ye){case a:me.trigger("pinchIn",[ye||null,be||0,ge||0,Se,Te,Oe]),t.pinchIn&&(w=t.pinchIn.call(me,n,ye||null,be||0,ge||0,Se,Te,Oe));break;case u:me.trigger("pinchOut",[ye||null,be||0,ge||0,Se,Te,Oe]),t.pinchOut&&(w=t.pinchOut.call(me,n,ye||null,be||0,ge||0,Se,Te,Oe))}}return c==d?s!==x&&s!==m||(clearTimeout(ke),clearTimeout(Ae),z()&&!G()?(Re=le(),ke=setTimeout(e.proxy((function(){Re=null,me.trigger("tap",[n.target]),t.tap&&(w=t.tap.call(me,n,n.target))}),this),t.doubleTapThreshold)):(Re=null,me.trigger("tap",[n.target]),t.tap&&(w=t.tap.call(me,n,n.target)))):c==f?s!==x&&s!==m||(clearTimeout(ke),clearTimeout(Ae),Re=null,me.trigger("doubletap",[n.target]),t.doubleTap&&(w=t.doubleTap.call(me,n,n.target))):c==g&&(s!==x&&s!==m||(clearTimeout(ke),Re=null,me.trigger("longtap",[n.target]),t.longTap&&(w=t.longTap.call(me,n,n.target)))),w}function H(){var e=!0;return null!==t.threshold&&(e=he>=t.threshold),e}function _(){var e=!1;return null!==t.cancelThreshold&&null!==de&&(e=ee(de)-he>=t.cancelThreshold),e}function q(){return!(t.maxTimeThreshold&&ge>=t.maxTimeThreshold)}function Q(){var e=Y(),n=V(),i=null===t.pinchThreshold||be>=t.pinchThreshold;return e&&n&&i}function C(){return!!(t.pinchStatus||t.pinchIn||t.pinchOut)}function F(){var e=q(),n=H(),t=Y(),i=V();return!_()&&i&&t&&n&&e}function X(){return!!(t.swipe||t.swipeStatus||t.swipeLeft||t.swipeRight||t.swipeUp||t.swipeDown)}function Y(){return Se===t.fingers||t.fingers===T||!S}function V(){return 0!==Oe[0].end.x}function W(){return!!t.tap}function z(){return!!t.doubleTap}function G(){if(null==Re)return!1;var e=le();return z()&&e-Re<=t.doubleTapThreshold}function Z(){Pe=0,Le=0}function B(){var e=!1;Pe&&(le()-Pe<=t.fingerReleaseThreshold&&(e=!0));return e}function J(e){me&&(!0===e?(me.bind(ue,L),me.bind(se,R),ce&&me.bind(ce,A)):(me.unbind(ue,L,!1),me.unbind(se,R,!1),ce&&me.unbind(ce,A,!1)),me.data(D+"_intouch",!0===e))}function K(e,n){var t={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return t.start.x=t.last.x=t.end.x=n.pageX||n.clientX,t.start.y=t.last.y=t.end.y=n.pageY||n.clientY,Oe[e]=t,t}function $(e){var n=void 0!==e.identifier?e.identifier:0,t=function(e){return Oe[e]||null}(n);return null===t&&(t=K(n,e)),t.last.x=t.end.x,t.last.y=t.end.y,t.end.x=e.pageX||e.clientX,t.end.y=e.pageY||e.clientY,t}function ee(e){if(Ee[e])return Ee[e].distance}function ne(e){return{direction:e,distance:0}}function te(){return De-Me}function ie(e,n){var t=Math.abs(e.x-n.x),i=Math.abs(e.y-n.y);return Math.round(Math.sqrt(t*t+i*i))}function re(e,n){if(a=n,(t=e).x==a.x&&t.y==a.y)return s;var t,a,u=function(e,n){var t=e.x-n.x,i=n.y-e.y,r=Math.atan2(i,t),l=Math.round(180*r/Math.PI);return l<0&&(l=360-Math.abs(l)),l}(e,n);return u<=45&&u>=0||u<=360&&u>=315?i:u>=135&&u<=225?r:u>45&&u<135?o:l}function le(){return(new Date).getTime()}t=e.extend({},t);var oe=S||M||!t.fallbackToMouseEvents,ae=oe?M?O?"MSPointerDown":"pointerdown":"touchstart":"mousedown",ue=oe?M?O?"MSPointerMove":"pointermove":"touchmove":"mousemove",se=oe?M?O?"MSPointerUp":"pointerup":"touchend":"mouseup",ce=oe?M?"mouseleave":null:"mouseleave",pe=M?O?"MSPointerCancel":"pointercancel":"touchcancel",he=0,de=null,fe=null,ge=0,we=0,ve=0,Te=1,be=0,ye=0,Ee=null,me=e(n),xe="start",Se=0,Oe={},Me=0,De=0,Pe=0,Le=0,Re=0,ke=null,Ae=null;try{me.bind(ae,P),me.bind(pe,k)}catch(n){e.error("events not supported "+ae+","+pe+" on jQuery.swipe")}this.enable=function(){return this.disable(),me.bind(ae,P),me.bind(pe,k),me},this.disable=function(){return I(),me},this.destroy=function(){I(),me.data(D,null),me=null},this.option=function(n,i){if("object"==typeof n)t=e.extend(t,n);else if(void 0!==t[n]){if(void 0===i)return t[n];t[n]=i}else{if(!n)return t;e.error("Option "+n+" does not exist on jQuery.swipe.options")}return null}}var i="left",r="right",l="up",o="down",a="in",u="out",s="none",c="auto",p="swipe",h="pinch",d="tap",f="doubletap",g="longtap",w="horizontal",v="vertical",T="all",b=10,y="start",E="move",m="end",x="cancel",S="ontouchstart"in window,O=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!S,M=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!S,D="TouchSwipe";e.fn.swipe=function(t){var i=e(this),r=i.data(D);if(r&&"string"==typeof t){if(r[t])return r[t].apply(r,Array.prototype.slice.call(arguments,1));e.error("Method "+t+" does not exist on jQuery.swipe")}else if(r&&"object"==typeof t)r.option.apply(r,arguments);else if(!(r||"object"!=typeof t&&t))return n.apply(this,arguments);return i},e.fn.swipe.version="1.6.18",e.fn.swipe.defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0},e.fn.swipe.phases={PHASE_START:y,PHASE_MOVE:E,PHASE_END:m,PHASE_CANCEL:x},e.fn.swipe.directions={LEFT:i,RIGHT:r,UP:l,DOWN:o,IN:a,OUT:u},e.fn.swipe.pageScroll={NONE:s,HORIZONTAL:w,VERTICAL:v,AUTO:c},e.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:T}}));