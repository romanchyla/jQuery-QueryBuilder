// globals: $
describe("QueryBuilder (Basic API)", function () {


  it("can set a different language interface", function (done) {
    expect($.fn.queryBuilder.defaults.get().lang.delete_group).to.eql('Delete');

    var original = $.fn.queryBuilder.defaults.get();

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../../src/i18n/fr.js';

    var checkit = function () {
      expect($.fn.queryBuilder.defaults.get().lang.delete_group).to.eql('Supprimer');
      $.fn.queryBuilder.defaults.set(original);
      expect($.fn.queryBuilder.defaults.get().lang.delete_group).to.eql('Delete');
      done();
    };

    script.onreadystatechange = function () {
      if (this.readyState == 'complete') checkit();
    };
    script.onload= checkit;

    head.appendChild(script);

  });

  it("respects the order of operators", function() {
    $('#builder').queryBuilder('destroy');
    $('#builder').queryBuilder({filters:[
      {
        id: 'name',
        label: 'Name',
        type: 'string',
        operators: ['not_equal', 'contains', 'equal']
      }
      ]
    });

    $('#builder').queryBuilder('setRules', {
      "condition": "AND",
      "rules": [
        {
          "id": "name",
          "field": "name",
          "type": "string",
          "input": "text",
          "operator": "equal",
          "value": "x"
        }
      ]
    });

    var vals = _.map($('#builder').find('#builder_rule_0>div.rule-operator-container>select>option'), function(x) {return $(x).val()});
    expect(vals).to.eql(['not_equal', 'contains', 'equal']);
  });

  it("allows to change conditions", function() {
    $('#builder').queryBuilder('destroy');
    $('#builder').queryBuilder({
      conditions: ['AND', 'OR', 'DEFOP'],
      filters:[
      {
        id: 'name',
        label: 'Name',
        type: 'string',
        operators: ['not_equal', 'contains', 'equal']
      }
    ]
    });

    $('#builder').queryBuilder('setRules', {
      "condition": "DEFOP",
      "rules": [
        {
          "id": "name",
          "field": "name",
          "type": "string",
          "input": "text",
          "operator": "equal",
          "value": "x"
        }
      ]
    });

    var vals = _.map($.find('label.btn-primary'), function(x) {return $(x).text()});
    expect(vals).to.eql(['AND', 'OR', 'DEFOP']);
    expect($('#builder').find('label.btn-primary.active').text()).to.be.eql('DEFOP');
  });

});