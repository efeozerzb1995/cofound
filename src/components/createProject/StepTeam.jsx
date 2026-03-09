import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Trash2 } from 'lucide-react';

export default function StepTeam({ data, onChange }) {
  const [currentRole, setCurrentRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');

  const addRole = () => {
    if (currentRole.trim()) {
      onChange({
        roles: [...data.roles, { role: currentRole.trim(), skills: [] }]
      });
      setCurrentRole('');
    }
  };

  const removeRole = (index) => {
    onChange({
      roles: data.roles.filter((_, i) => i !== index)
    });
  };

  const addSkillToRole = (roleIndex) => {
    if (currentSkills.trim()) {
      const updatedRoles = [...data.roles];
      updatedRoles[roleIndex].skills.push(currentSkills.trim());
      onChange({ roles: updatedRoles });
      setCurrentSkills('');
    }
  };

  const removeSkill = (roleIndex, skillIndex) => {
    const updatedRoles = [...data.roles];
    updatedRoles[roleIndex].skills = updatedRoles[roleIndex].skills.filter((_, i) => i !== skillIndex);
    onChange({ roles: updatedRoles });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-slate-300 mb-3 block">
          Aranan Roller <span className="text-red-400">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
            placeholder="Örn: Yazılımcı, Tasarımcı, Biyomühendis"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Button 
            type="button" 
            onClick={addRole}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {data.roles.length > 0 && (
        <div className="space-y-3">
          {data.roles.map((roleItem, roleIndex) => (
            <Card key={roleIndex} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-medium">{roleItem.role}</h4>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeRole(roleIndex)}
                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs">Gerekli Beceriler</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentSkills}
                      onChange={(e) => setCurrentSkills(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillToRole(roleIndex))}
                      placeholder="Beceri ekle"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 text-sm"
                    />
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={() => addSkillToRole(roleIndex)}
                      className="bg-slate-600 hover:bg-slate-500"
                    >
                      Ekle
                    </Button>
                  </div>

                  {roleItem.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {roleItem.skills.map((skill, skillIndex) => (
                        <Badge 
                          key={skillIndex}
                          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 pr-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(roleIndex, skillIndex)}
                            className="ml-2 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data.roles.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Projeniz için aranan rolleri ekleyin
        </div>
      )}
    </div>
  );
}