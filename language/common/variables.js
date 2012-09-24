/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */

if (!Blockly.Language) Blockly.Language = {};

Blockly.Language.variables_get = {
  // Variable getter.
  category: null,  // Variables are handled specially.
  helpUrl: Blockly.LANG_VARIABLES_GET_HELPURL,
  init: function() {
    this.appendTitle(Blockly.LANG_VARIABLES_GET_TITLE_1);
    this.appendTitle(new Blockly.FieldDropdown(
        Blockly.Variables.dropdownCreate, Blockly.Variables.dropdownChange),
        'VAR').setText(Blockly.LANG_VARIABLES_GET_ITEM);
    this.setTooltip(Blockly.LANG_VARIABLES_GET_TOOLTIP_1);

    this.setOutput(true,null);

    this.setColour(230);
    this.varType_ = Number;


  },
  mutationToDom: Blockly.Variables.mutationToDom,
  domToMutation: Blockly.Variables.domToMutation,


  getVarName : function() {
    return this.getTitleText('VAR');
  },
  getVars: function() {
    return [this.getVarName()];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getVarName())) {
      this.setTitleText(newName, 'VAR');
    }
  },

  getVarType: function() {
    return this.varType_;
  },

  changeType: function(name, newTypeStr) {
    if (Blockly.Names.equals(name, this.getVarName())) {

      var newColour = Blockly.Variables.colourFromType(newTypeStr);
      var newType = Blockly.Variables.typeFromStr(newTypeStr);

      if (newType != this.varType_) {
        this.varType_ = newType;
        this.setColour(newColour);
        this.setOutput(false);
        this.setOutput(true,this.varType_);
      }
    }
  }
};


Blockly.Language.variables_create = {

  // Variable creator.
  category: null,  // Variables are handled specially.
  //helpUrl: Blockly.LANG_VARIABLES_GET_HELPURL,
  init: function() {

    var varName = 'item';
    if (Blockly.Variables.variableExists(varName)) {
      varName = Blockly.Variables.generateUniqueName();
    }

    this.appendTitle("create");
    this.appendTitle(
        new Blockly.FieldDropdown(
            Blockly.Variables.dropdownCreate,
            Blockly.Variables.dropdownChange
        ),
        'VAR'
    ).setText(varName);

    this.setTooltip("@TODO");

    this.setColour(230);
    this.varType_ = Number;

    this.appendInput('', Blockly.INPUT_VALUE, 'VALUE', this.varType_);

    this.setPreviousStatement(true);
    this.setNextStatement(true);

    this.setMutator(
        new Blockly.Mutator(
            ['varType_number','varType_string']
        )
    );
  },

  getVarName : function() {
    return this.getTitleText('VAR');
  },
  getVars: function() {
    return [this.getVarName()];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getVarName())) {
      this.setTitleText(newName, 'VAR');
    }
  },

  getVarType: function() {
    console.log('getVarType : ' + this.getVarName() + ' is of type' + this.varType_);
    return this.varType_;
  },

  changeType: function(name, newTypeStr) {
    if (Blockly.Names.equals(name, this.getVarName())) {

      var newColour = Blockly.Variables.colourFromType(newTypeStr);
      var newType = Blockly.Variables.typeFromStr(newTypeStr);

      if (newType != this.varType_) {
        this.varType_ = newType;
        this.setColour(newColour);
        this.removeInput('VALUE');
        this.appendInput('', Blockly.INPUT_VALUE, 'VALUE', newType);
        return true;
      }
      return false;
    }
  },
  mutationToDom: Blockly.Variables.mutationToDom,
  domToMutation: Blockly.Variables.domToMutation,

  decompose: function(workspace) {
    var containerBlock = new Blockly.Block(workspace, 'variables_create_create');
    containerBlock.initSvg();


    var connection = containerBlock.inputList[0];
    var typeBlock = null; 
    if (this.varType_ == Number) {
      typeBlock = new Blockly.Block(workspace, 'varType_number');
    } else {
      typeBlock = new Blockly.Block(workspace, 'varType_string');
    }
    typeBlock.initSvg();
    connection.connect(typeBlock.previousConnection);
    return containerBlock;
    
  },
  compose: function(containerBlock) {

    var typeBlock = containerBlock.getInputTargetBlock('STACK');
    
    var typeChanged = this.changeType(
      this.getVarName(),
      typeBlock.valueType
    );

    if (typeChanged) {
      //We make the change of type to apply to everywhere this variable
      // is used
      Blockly.Variables.changeTypeVariable(
        this.getVarName(),
        typeBlock.valueType
      );
    }
  }

};



Blockly.Language.variables_create_create = {
  init: function() {
    this.setColour(330);
    this.appendTitle("create");
    this.appendInput('', Blockly.NEXT_STATEMENT, 'STACK');
    this.contextMenu = false;
  }
};


Blockly.Language.varType_number = {
  // Number type.
  valueType: 'number',
  init: function() {
    this.setColour(230);
    this.appendTitle('number');
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};

Blockly.Language.varType_string = {
  // String type.
  valueType: 'string',
  init: function() {
    this.setColour(230);
    this.appendTitle('string');
    this.setPreviousStatement(true);
    this.setTooltip('');
  }
};



Blockly.Language.variables_set = {
  // Variable setter.
  category: null,  // Variables are handled specially.
  helpUrl: Blockly.LANG_VARIABLES_SET_HELPURL,
  init: function() {
    this.setColour(230);
    this.appendTitle(Blockly.LANG_VARIABLES_SET_TITLE_1);
    this.appendTitle(new Blockly.FieldDropdown(
        Blockly.Variables.dropdownCreate, Blockly.Variables.dropdownChange),
        'VAR').setText(Blockly.LANG_VARIABLES_SET_ITEM);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_VARIABLES_SET_TOOLTIP_1);


    this.varType_ = Number;
    this.appendInput('', Blockly.INPUT_VALUE, 'VALUE', this.varType_);
  },

  mutationToDom: Blockly.Variables.mutationToDom,
  domToMutation: Blockly.Variables.domToMutation,
  getVarType: function() {
    return this.varType_;
  },
  changeType: function(name, newTypeStr) {
    console.log ('change type to ' + newTypeStr);
    if (Blockly.Names.equals(name, this.getVarName())) {

      var newColour = Blockly.Variables.colourFromType(newTypeStr);
      var newType = Blockly.Variables.typeFromStr(newTypeStr);

      if (newType != this.varType_) {
        this.varType_ = newType;
        this.setColour(newColour);
        this.removeInput('VALUE');
        this.appendInput('', Blockly.INPUT_VALUE, 'VALUE', newType);
        return true;
      }
      return false;
    }
  },
  getVarName : function() {
    return this.getTitleText('VAR');
  },
  getVars: function() {
    return [this.getTitleText('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleText('VAR'))) {
      this.setTitleText(newName, 'VAR');
    }
  }
};
