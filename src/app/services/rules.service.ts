export interface RulesData {
    [id: string]: RuleTopic;
}

export interface RuleTopic {
    [id: string]: RuleSubTopic;
}

export interface RuleSubTopic {
    [id: string]: RuleInstance[];
}

export type RuleInstance = string;

import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import rules from './rules_txt';

export interface IRulesService {
    // Direct get methods
    getAllTopicIds(): string[];
    getAllSubTopicIds(topicId: string): string[];
    getSubTopic(topic: RuleTopic, id: string): RuleInstance[];

    // Keyword Lookup
    getKeywordDefinition(keyword: string): RuleInstance;

    // Query methods
    findAllTopicsMatching(term: string): Array<RuleTopic>;
    findAllSubTopicsMatching(topic: RuleTopic, term: string): Array<RuleSubTopic>;
    findAllInstancesMatching(topic: RuleSubTopic, term: string): Array<RuleInstance>;
}

@Injectable({ providedIn: 'root' })
export class RulesService {
    topics: string[];
    glossary: string;

    constructor(public loadingController: LoadingController) {
        this.topics = Object.keys(rules);
        for (let i = 0; i < this.topics.length; i++) {
            if (this.topics[i].toLowerCase() == 'glossary') {
                this.glossary = this.topics[i];
            }
        }
    }

    // Direct get methods
    getAllRules(): string[] {
        return rules;
    }

    getAllTopicIds(): string[] {
        return this.topics;
    }

    getAllSubTopicIds(topicId: RuleTopic): string[] {
        return Object.keys(topicId);
        // return Object.keys(rules[topicId]);
    }

    getSubTopic(topic: RuleTopic, id: string): RuleInstance[] {
        let subtopic = rules[topic][id];
        if (typeof subtopic === 'string') {
            subtopic = [subtopic];
        }
        return subtopic;
    }

    getTopicFromSubtopic(subtopic: string): RuleTopic {
        for (let i = 0; i < this.topics.length; i++) {
            if (this.topics[i].startsWith(subtopic.substring(0, 1))) {
                return rules[this.topics[i]];
            }
        }
    }

    getRuleDetails(rule: RuleInstance): Array<RuleInstance> {
        let subsection: Array<RuleInstance>, section: string;
        section = this.glossary;
        for (let i = 0; i < this.topics.length; i++) {
            if (this.topics[i].startsWith(rule.substring(0, 1))) {
                section = this.topics[i];
            }
        }
        subsection = rules[section][rule];
        if (typeof subsection === 'string') {
            subsection = [subsection];
        }
        return subsection;
    }

    // Keyword Lookup
    getKeywordDefinition(keyword: string): RuleInstance {
        let def: string = 'undefined';
        keyword = keyword
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        if (!this.isRule(keyword) && keyword != null && keyword != '') {
            def = rules[this.glossary][keyword];
        }
        return def;
    }

    // Query methods
    findAllTopicsMatching(term: string): Array<RuleTopic> {
        let temp: Array<RuleTopic>;
        for (const topic in this.topics) {
            if (topic.includes(term)) {
                temp.push(rules[topic]);
            }
            return temp;
        }
    }

    findAllSubTopicsMatching(topic: RuleTopic, term: string): Array<RuleSubTopic[]> {
        if (term == null || term == '') {
            return [];
        } else {
            let temp: Array<RuleSubTopic[]>;
            for (const subtopic in topic) {
                // check subtopic for match against term and add to result if it does
                if (subtopic.includes(term)) {
                    temp.push(rules[topic[subtopic]]);
                }
            }
            console.log(temp);
            return temp;
        }
    }

    findAllInstancesMatching(term: string, withHeaders: boolean): Array<RuleInstance> {
        if (term == null || term == '') {
            return this.topics;
        } else {
            let temp = Array<RuleInstance>();
            this.topics.forEach((subtopic) => {
                let subrule = rules[subtopic];
                Object.keys(subrule).forEach((instance) => {
                    let detail = rules[subtopic][instance];
                    let added = false;
                    if (typeof detail !== 'object') {
                        detail = [detail];
                    }
                    detail.forEach((explanation: string) => {
                        if (explanation.toLowerCase().search(term) !== -1 && !added) {
                            if (withHeaders) {
                                if (this.isRule(instance)) {
                                    temp.push(instance.substring(4));
                                } else {
                                    temp.push(instance);
                                }
                            }
                            temp.push(explanation);
                            added = true;
                        }
                    });
                });
            });

            if (temp.length >= 1) {
                return temp;
            } else {
                return ['No results found :('];
            }
        }
    }

    // determine if a given rule is numeric or a glossary term
    isRule(ruleToCheck: string) {
        return this.isNumeric(ruleToCheck.substring(0, 2));
    }

    // determines if a string value is numeric
    isNumeric(value: string) {
        return /^-{0,1}\d+$/.test(value);
    }
}
